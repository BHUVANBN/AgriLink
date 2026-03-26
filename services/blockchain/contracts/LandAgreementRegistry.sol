// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title LandAgreementRegistry
 * @notice Stores and manages land integration agreements between farmers on Polygon.
 * @dev BUG-012 fix: Single, canonical contract version.
 *      BUG-017 fix: Land stored as centiacres (uint32) — no floating point.
 */
contract LandAgreementRegistry {
    
    // ── Enums ────────────────────────────────────────────────
    
    enum AgreementStatus { Draft, PendingSignature, Active, Expired, Revoked }
    
    // ── Structs ──────────────────────────────────────────────
    
    struct LandParcel {
        string surveyNumber;
        string hissaNumber;
        uint32 extentCentiacres;   // BUG-017 fix: 1 acre = 100 centiacres
        uint8 profitSharePercent;  // must sum to 100 with other party
    }
    
    struct Signature {
        address signer;
        string signerName;
        string role;               // "farmer1" or "farmer2"
        uint256 signedAt;
    }
    
    struct Agreement {
        bytes32 agreementId;       // keccak256(farmer1+farmer2+timestamp)
        address creator;
        
        // Farmer 1
        address farmer1Address;
        string farmer1Name;
        string farmer1UserId;      // Off-chain MongoDB ObjectId
        LandParcel farmer1Land;
        
        // Farmer 2
        address farmer2Address;
        string farmer2Name;
        string farmer2UserId;
        LandParcel farmer2Land;
        
        // Period
        uint64 startTimestamp;
        uint64 endTimestamp;
        
        // Document
        string documentCid;        // IPFS CID of agreement PDF
        string metadataCid;        // IPFS CID of agreement metadata JSON
        
        // State
        AgreementStatus status;
        Signature[] signatures;
        uint256 createdAt;
        uint256 updatedAt;
    }
    
    // ── State ────────────────────────────────────────────────
    
    address public immutable owner;
    
    mapping(bytes32 => Agreement) private agreements;
    mapping(address => bytes32[]) private userAgreements;
    
    uint256 public totalAgreements;
    
    // ── Events ───────────────────────────────────────────────
    
    event AgreementCreated(
        bytes32 indexed agreementId,
        address indexed creator,
        string farmer1UserId,
        string farmer2UserId,
        uint256 createdAt
    );
    
    event AgreementSigned(
        bytes32 indexed agreementId,
        address indexed signer,
        string signerRole,
        AgreementStatus newStatus
    );
    
    event AgreementRevoked(
        bytes32 indexed agreementId,
        address indexed revokedBy,
        uint256 revokedAt
    );
    
    event DocumentUpdated(
        bytes32 indexed agreementId,
        string documentCid,
        string metadataCid
    );
    
    // ── Modifiers ─────────────────────────────────────────────
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }
    
    modifier agreementExists(bytes32 agreementId) {
        require(agreements[agreementId].createdAt > 0, "Agreement does not exist");
        _;
    }
    
    modifier onlyParty(bytes32 agreementId) {
        Agreement storage agr = agreements[agreementId];
        require(
            msg.sender == agr.farmer1Address ||
            msg.sender == agr.farmer2Address ||
            msg.sender == owner,
            "Not a party to this agreement"
        );
        _;
    }
    
    // ── Constructor ───────────────────────────────────────────
    
    constructor() {
        owner = msg.sender;
    }
    
    // ── Write Functions ───────────────────────────────────────
    
    /**
     * @notice Create a new land integration agreement.
     * @param farmer1UserId Off-chain user ID for farmer 1
     * @param farmer1Name Display name of farmer 1
     * @param farmer1Address Wallet address of farmer 1
     * @param farmer1Survey Survey number of farmer 1's land
     * @param farmer1Centiacres Land extent in centiacres
     * @param farmer1SharePercent Profit share percent (must sum to 100)
     * @param farmer2UserId Off-chain user ID for farmer 2
     * @param farmer2Name Display name of farmer 2
     * @param farmer2Address Wallet address of farmer 2
     * @param farmer2Survey Survey number of farmer 2's land
     * @param farmer2Centiacres Land extent in centiacres
     * @param farmer2SharePercent Profit share percent
     * @param startTs Unix timestamp for start date
     * @param endTs Unix timestamp for end date
     * @param documentCid IPFS CID of agreement document
     * @return agreementId The unique ID of the created agreement
     */
    function createAgreement(
        string calldata farmer1UserId,
        string calldata farmer1Name,
        address farmer1Address,
        string calldata farmer1Survey,
        uint32 farmer1Centiacres,
        uint8 farmer1SharePercent,
        string calldata farmer2UserId,
        string calldata farmer2Name,
        address farmer2Address,
        string calldata farmer2Survey,
        uint32 farmer2Centiacres,
        uint8 farmer2SharePercent,
        uint64 startTs,
        uint64 endTs,
        string calldata documentCid
    ) external onlyOwner returns (bytes32 agreementId) {
        require(farmer1SharePercent + farmer2SharePercent == 100, "Share must sum to 100%");
        require(farmer1Centiacres > 0 && farmer2Centiacres > 0, "Land must be > 0");
        require(startTs < endTs, "Invalid period");
        require(farmer1Address != farmer2Address, "Farmers must be different");
        
        agreementId = keccak256(abi.encodePacked(
            farmer1UserId, farmer2UserId, block.timestamp
        ));
        
        require(agreements[agreementId].createdAt == 0, "Agreement ID collision");
        
        Agreement storage agr = agreements[agreementId];
        agr.agreementId = agreementId;
        agr.creator = msg.sender;
        agr.farmer1Address = farmer1Address;
        agr.farmer1Name = farmer1Name;
        agr.farmer1UserId = farmer1UserId;
        agr.farmer1Land = LandParcel(farmer1Survey, "", farmer1Centiacres, farmer1SharePercent);
        agr.farmer2Address = farmer2Address;
        agr.farmer2Name = farmer2Name;
        agr.farmer2UserId = farmer2UserId;
        agr.farmer2Land = LandParcel(farmer2Survey, "", farmer2Centiacres, farmer2SharePercent);
        agr.startTimestamp = startTs;
        agr.endTimestamp = endTs;
        agr.documentCid = documentCid;
        agr.status = AgreementStatus.PendingSignature;
        agr.createdAt = block.timestamp;
        agr.updatedAt = block.timestamp;
        
        userAgreements[farmer1Address].push(agreementId);
        userAgreements[farmer2Address].push(agreementId);
        totalAgreements++;
        
        emit AgreementCreated(agreementId, msg.sender, farmer1UserId, farmer2UserId, block.timestamp);
    }
    
    /**
     * @notice Sign an agreement. Both parties must sign to activate it.
     */
    function signAgreement(bytes32 agreementId, string calldata signerName)
        external
        agreementExists(agreementId)
        onlyParty(agreementId)
    {
        Agreement storage agr = agreements[agreementId];
        require(agr.status == AgreementStatus.PendingSignature, "Agreement not pending signature");
        
        string memory role = (msg.sender == agr.farmer1Address) ? "farmer1" : "farmer2";
        
        // Check not already signed
        for (uint i = 0; i < agr.signatures.length; i++) {
            require(agr.signatures[i].signer != msg.sender, "Already signed");
        }
        
        agr.signatures.push(Signature(msg.sender, signerName, role, block.timestamp));
        agr.updatedAt = block.timestamp;
        
        // Both parties signed → activate
        if (agr.signatures.length == 2) {
            agr.status = AgreementStatus.Active;
        }
        
        emit AgreementSigned(agreementId, msg.sender, role, agr.status);
    }
    
    /**
     * @notice Revoke an active agreement. Only either party or owner can revoke.
     */
    function revokeAgreement(bytes32 agreementId)
        external
        agreementExists(agreementId)
        onlyParty(agreementId)
    {
        Agreement storage agr = agreements[agreementId];
        require(
            agr.status == AgreementStatus.Active || agr.status == AgreementStatus.PendingSignature,
            "Cannot revoke in current status"
        );
        agr.status = AgreementStatus.Revoked;
        agr.updatedAt = block.timestamp;
        emit AgreementRevoked(agreementId, msg.sender, block.timestamp);
    }
    
    /**
     * @notice Update the IPFS document CID (e.g., after signed PDF generated).
     */
    function updateDocument(bytes32 agreementId, string calldata documentCid, string calldata metadataCid)
        external
        onlyOwner
        agreementExists(agreementId)
    {
        Agreement storage agr = agreements[agreementId];
        agr.documentCid = documentCid;
        agr.metadataCid = metadataCid;
        agr.updatedAt = block.timestamp;
        emit DocumentUpdated(agreementId, documentCid, metadataCid);
    }
    
    // ── Read Functions ────────────────────────────────────────
    
    function getAgreement(bytes32 agreementId)
        external
        view
        agreementExists(agreementId)
        returns (
            bytes32 id,
            address creator,
            string memory farmer1Name,
            string memory farmer1UserId,
            uint32 farmer1Centiacres,
            uint8 farmer1Share,
            string memory farmer2Name,
            string memory farmer2UserId,
            uint32 farmer2Centiacres,
            uint8 farmer2Share,
            string memory documentCid,
            uint8 status,
            uint256 signatureCount,
            uint256 createdAt
        )
    {
        Agreement storage agr = agreements[agreementId];
        return (
            agr.agreementId,
            agr.creator,
            agr.farmer1Name,
            agr.farmer1UserId,
            agr.farmer1Land.extentCentiacres,
            agr.farmer1Land.profitSharePercent,
            agr.farmer2Name,
            agr.farmer2UserId,
            agr.farmer2Land.extentCentiacres,
            agr.farmer2Land.profitSharePercent,
            agr.documentCid,
            uint8(agr.status),
            agr.signatures.length,
            agr.createdAt
        );
    }
    
    function getUserAgreements(address user)
        external
        view
        returns (bytes32[] memory)
    {
        return userAgreements[user];
    }
    
    function getAgreementStatus(bytes32 agreementId)
        external
        view
        agreementExists(agreementId)
        returns (AgreementStatus)
    {
        return agreements[agreementId].status;
    }
    
    function hasSignedAgreement(bytes32 agreementId, address user)
        external
        view
        agreementExists(agreementId)
        returns (bool)
    {
        Agreement storage agr = agreements[agreementId];
        for (uint i = 0; i < agr.signatures.length; i++) {
            if (agr.signatures[i].signer == user) return true;
        }
        return false;
    }
    
    function verifyDocumentCid(bytes32 agreementId, string calldata cid)
        external
        view
        agreementExists(agreementId)
        returns (bool)
    {
        return keccak256(bytes(agreements[agreementId].documentCid)) == keccak256(bytes(cid));
    }
}
