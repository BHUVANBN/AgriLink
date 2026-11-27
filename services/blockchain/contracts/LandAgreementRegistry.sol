// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title  LandAgreementRegistry (v2)
 * @notice Tamper-evident registry of land-integration agreements between two
 *         AgriLink farmers, deployed on Polygon (Amoy testnet is free).
 *
 * Trust model (gasless "relayer" pattern — farmers never need crypto or gas):
 *  - The AgriLink backend holds one or more RELAYER keys and submits every
 *    transaction, paying gas from a faucet-funded wallet.
 *  - Each farmer is identified on-chain by `partyId = keccak256(userId)`,
 *    computed BY THE CONTRACT from the off-chain user ID. Anyone can recompute
 *    it, so a record can't silently be re-pointed at a different person.
 *  - A record is immutable once written: terms, parties, land and document CID
 *    can never be edited — only signed, revoked or superseded by a new record.
 *  - The PDF lives on IPFS; its content-addressed CID is stored on-chain, so
 *    `verifyDocumentCid` proves a given document is the one both parties signed.
 *
 * Safety controls:
 *  - Two-step ownership transfer (a typo can't brick the contract).
 *  - Owner can add/remove relayers (rotate a leaked key without redeploying)
 *    and pause all writes in an emergency.
 */
contract LandAgreementRegistry {

    // ── Types ────────────────────────────────────────────────

    enum AgreementStatus { Draft, PendingSignature, Active, Expired, Revoked }

    struct LandParcel {
        string surveyNumber;
        uint32 extentCentiacres;   // 1 acre = 100 centiacres (no floating point)
        uint8 profitSharePercent;  // farmer1 + farmer2 == 100
    }

    struct Party {
        bytes32 partyId;           // keccak256(bytes(userId))
        string userId;
        string name;
        LandParcel land;
        uint64 signedAt;           // 0 = not signed
    }

    struct Agreement {
        bytes32 agreementId;
        address relayer;           // which relayer key wrote it
        Party farmer1;
        Party farmer2;
        uint64 startTimestamp;
        uint64 endTimestamp;
        string documentCid;        // IPFS CID of the agreement PDF
        AgreementStatus status;
        uint64 createdAt;
        uint64 updatedAt;
    }

    struct CreateParams {
        string farmer1UserId;
        string farmer1Name;
        string farmer1Survey;
        uint32 farmer1Centiacres;
        uint8 farmer1SharePercent;
        string farmer2UserId;
        string farmer2Name;
        string farmer2Survey;
        uint32 farmer2Centiacres;
        uint8 farmer2SharePercent;
        uint64 startTimestamp;
        uint64 endTimestamp;
        string documentCid;
    }

    // ── State ────────────────────────────────────────────────

    address public owner;
    address public pendingOwner;
    bool public paused;
    mapping(address => bool) public isRelayer;

    mapping(bytes32 => Agreement) private agreements;
    mapping(bytes32 => bytes32[]) private partyAgreements; // partyId => agreementIds
    uint256 public totalAgreements;

    // ── Events ───────────────────────────────────────────────

    event AgreementCreated(bytes32 indexed agreementId, bytes32 indexed farmer1PartyId, bytes32 indexed farmer2PartyId, string documentCid);
    event AgreementSigned(bytes32 indexed agreementId, bytes32 indexed partyId, uint8 newStatus);
    event AgreementRevoked(bytes32 indexed agreementId, bytes32 indexed byPartyId, string reason);
    event RelayerUpdated(address indexed relayer, bool allowed);
    event Paused(bool paused);
    event OwnershipTransferStarted(address indexed previousOwner, address indexed newOwner);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // ── Errors (cheaper than revert strings) ─────────────────

    error NotOwner();
    error NotRelayer();
    error ContractPaused();
    error AgreementNotFound();
    error InvalidShares();
    error InvalidLand();
    error InvalidPeriod();
    error SameParty();
    error EmptyField();
    error NotPending();
    error NotAParty();
    error AlreadySigned();
    error CannotRevoke();
    error ZeroAddress();

    // ── Modifiers ────────────────────────────────────────────

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    modifier onlyRelayer() {
        if (!isRelayer[msg.sender]) revert NotRelayer();
        _;
    }

    modifier whenNotPaused() {
        if (paused) revert ContractPaused();
        _;
    }

    modifier exists(bytes32 agreementId) {
        if (agreements[agreementId].createdAt == 0) revert AgreementNotFound();
        _;
    }

    constructor() {
        owner = msg.sender;
        isRelayer[msg.sender] = true;
        emit OwnershipTransferred(address(0), msg.sender);
        emit RelayerUpdated(msg.sender, true);
    }

    // ── Identity ─────────────────────────────────────────────

    function partyIdOf(string calldata userId) public pure returns (bytes32) {
        return keccak256(bytes(userId));
    }

    // ── Write: agreements ────────────────────────────────────

    function createAgreement(CreateParams calldata p)
        external
        onlyRelayer
        whenNotPaused
        returns (bytes32 agreementId)
    {
        if (uint16(p.farmer1SharePercent) + uint16(p.farmer2SharePercent) != 100) revert InvalidShares();
        if (p.farmer1Centiacres == 0 || p.farmer2Centiacres == 0) revert InvalidLand();
        if (p.startTimestamp >= p.endTimestamp || p.endTimestamp <= block.timestamp) revert InvalidPeriod();
        if (bytes(p.farmer1UserId).length == 0 || bytes(p.farmer2UserId).length == 0
            || bytes(p.farmer1Survey).length == 0 || bytes(p.farmer2Survey).length == 0
            || bytes(p.documentCid).length == 0) revert EmptyField();

        bytes32 id1 = keccak256(bytes(p.farmer1UserId));
        bytes32 id2 = keccak256(bytes(p.farmer2UserId));
        if (id1 == id2) revert SameParty();

        // totalAgreements in the hash → unique even for two agreements in one block
        agreementId = keccak256(abi.encode(id1, id2, block.chainid, block.timestamp, totalAgreements));

        Agreement storage a = agreements[agreementId];
        a.agreementId = agreementId;
        a.relayer = msg.sender;
        a.farmer1 = Party(id1, p.farmer1UserId, p.farmer1Name, LandParcel(p.farmer1Survey, p.farmer1Centiacres, p.farmer1SharePercent), 0);
        a.farmer2 = Party(id2, p.farmer2UserId, p.farmer2Name, LandParcel(p.farmer2Survey, p.farmer2Centiacres, p.farmer2SharePercent), 0);
        a.startTimestamp = p.startTimestamp;
        a.endTimestamp = p.endTimestamp;
        a.documentCid = p.documentCid;
        a.status = AgreementStatus.PendingSignature;
        a.createdAt = uint64(block.timestamp);
        a.updatedAt = uint64(block.timestamp);

        partyAgreements[id1].push(agreementId);
        partyAgreements[id2].push(agreementId);
        unchecked { totalAgreements++; }

        emit AgreementCreated(agreementId, id1, id2, p.documentCid);
    }

    /**
     * @notice Record a party's signature. The backend only relays this after
     *         re-authenticating the farmer (password check).
     */
    function signAgreement(bytes32 agreementId, string calldata signerUserId)
        external
        onlyRelayer
        whenNotPaused
        exists(agreementId)
    {
        Agreement storage a = agreements[agreementId];
        if (_effectiveStatus(a) != AgreementStatus.PendingSignature) revert NotPending();

        bytes32 pid = keccak256(bytes(signerUserId));
        Party storage party;
        if (pid == a.farmer1.partyId) party = a.farmer1;
        else if (pid == a.farmer2.partyId) party = a.farmer2;
        else revert NotAParty();

        if (party.signedAt != 0) revert AlreadySigned();
        party.signedAt = uint64(block.timestamp);
        a.updatedAt = uint64(block.timestamp);

        if (a.farmer1.signedAt != 0 && a.farmer2.signedAt != 0) {
            a.status = AgreementStatus.Active;
        }
        emit AgreementSigned(agreementId, pid, uint8(a.status));
    }

    /**
     * @notice Either party (relayed) may revoke a pending or active agreement.
     */
    function revokeAgreement(bytes32 agreementId, string calldata byUserId, string calldata reason)
        external
        onlyRelayer
        whenNotPaused
        exists(agreementId)
    {
        Agreement storage a = agreements[agreementId];
        bytes32 pid = keccak256(bytes(byUserId));
        if (pid != a.farmer1.partyId && pid != a.farmer2.partyId) revert NotAParty();
        AgreementStatus s = _effectiveStatus(a);
        if (s != AgreementStatus.Active && s != AgreementStatus.PendingSignature) revert CannotRevoke();

        a.status = AgreementStatus.Revoked;
        a.updatedAt = uint64(block.timestamp);
        emit AgreementRevoked(agreementId, pid, reason);
    }

    // ── Write: administration ────────────────────────────────

    function setRelayer(address relayer, bool allowed) external onlyOwner {
        if (relayer == address(0)) revert ZeroAddress();
        isRelayer[relayer] = allowed;
        emit RelayerUpdated(relayer, allowed);
    }

    function setPaused(bool value) external onlyOwner {
        paused = value;
        emit Paused(value);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();
        pendingOwner = newOwner;
        emit OwnershipTransferStarted(owner, newOwner);
    }

    function acceptOwnership() external {
        if (msg.sender != pendingOwner) revert NotOwner();
        emit OwnershipTransferred(owner, pendingOwner);
        owner = pendingOwner;
        pendingOwner = address(0);
    }

    // ── Read ─────────────────────────────────────────────────

    function _effectiveStatus(Agreement storage a) private view returns (AgreementStatus) {
        if (a.status == AgreementStatus.Active && block.timestamp > a.endTimestamp) return AgreementStatus.Expired;
        if (a.status == AgreementStatus.PendingSignature && block.timestamp > a.endTimestamp) return AgreementStatus.Expired;
        return a.status;
    }

    struct AgreementView {
        bytes32 agreementId;
        address relayer;
        string farmer1UserId;
        string farmer1Name;
        string farmer1Survey;
        uint32 farmer1Centiacres;
        uint8 farmer1SharePercent;
        uint64 farmer1SignedAt;
        string farmer2UserId;
        string farmer2Name;
        string farmer2Survey;
        uint32 farmer2Centiacres;
        uint8 farmer2SharePercent;
        uint64 farmer2SignedAt;
        uint64 startTimestamp;
        uint64 endTimestamp;
        string documentCid;
        uint8 status;
        uint64 createdAt;
        uint64 updatedAt;
    }

    function getAgreement(bytes32 agreementId) external view exists(agreementId) returns (AgreementView memory v) {
        Agreement storage a = agreements[agreementId];
        v.agreementId = a.agreementId;
        v.relayer = a.relayer;
        v.farmer1UserId = a.farmer1.userId;
        v.farmer1Name = a.farmer1.name;
        v.farmer1Survey = a.farmer1.land.surveyNumber;
        v.farmer1Centiacres = a.farmer1.land.extentCentiacres;
        v.farmer1SharePercent = a.farmer1.land.profitSharePercent;
        v.farmer1SignedAt = a.farmer1.signedAt;
        v.farmer2UserId = a.farmer2.userId;
        v.farmer2Name = a.farmer2.name;
        v.farmer2Survey = a.farmer2.land.surveyNumber;
        v.farmer2Centiacres = a.farmer2.land.extentCentiacres;
        v.farmer2SharePercent = a.farmer2.land.profitSharePercent;
        v.farmer2SignedAt = a.farmer2.signedAt;
        v.startTimestamp = a.startTimestamp;
        v.endTimestamp = a.endTimestamp;
        v.documentCid = a.documentCid;
        v.status = uint8(_effectiveStatus(a));
        v.createdAt = a.createdAt;
        v.updatedAt = a.updatedAt;
    }

    function getAgreementStatus(bytes32 agreementId) external view exists(agreementId) returns (AgreementStatus) {
        return _effectiveStatus(agreements[agreementId]);
    }

    function getPartyAgreements(string calldata userId) external view returns (bytes32[] memory) {
        return partyAgreements[keccak256(bytes(userId))];
    }

    function verifyDocumentCid(bytes32 agreementId, string calldata cid) external view exists(agreementId) returns (bool) {
        return keccak256(bytes(agreements[agreementId].documentCid)) == keccak256(bytes(cid));
    }
}
