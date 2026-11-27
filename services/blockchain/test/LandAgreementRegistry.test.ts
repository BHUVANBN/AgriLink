import { expect } from 'chai';
import { ethers } from 'hardhat';
import { time } from '@nomicfoundation/hardhat-network-helpers';

const DAY = 86_400;

async function deploy() {
  const [owner, relayer2, stranger, newOwner] = await ethers.getSigners();
  const Factory = await ethers.getContractFactory('LandAgreementRegistry');
  const registry = await Factory.deploy();
  await registry.waitForDeployment();
  return { registry, owner, relayer2, stranger, newOwner };
}

async function params(overrides: Record<string, unknown> = {}) {
  const now = await time.latest();
  return {
    farmer1UserId: 'user-ramesh',
    farmer1Name: 'Ramesh Kumar',
    farmer1Survey: '45/2',
    farmer1Centiacres: 250,
    farmer1SharePercent: 60,
    farmer2UserId: 'user-lakshmi',
    farmer2Name: 'Lakshmi Devi',
    farmer2Survey: '46/1',
    farmer2Centiacres: 150,
    farmer2SharePercent: 40,
    startTimestamp: now,
    endTimestamp: now + 365 * DAY,
    documentCid: 'bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi',
    ...overrides,
  };
}

async function create(registry: any, overrides = {}) {
  const tx = await registry.createAgreement(await params(overrides));
  const receipt = await tx.wait();
  const ev = receipt.logs.map((l: any) => registry.interface.parseLog(l)).find((e: any) => e?.name === 'AgreementCreated');
  return ev.args.agreementId as string;
}

describe('LandAgreementRegistry', () => {
  it('creates an agreement bound to keccak256(userId) party IDs', async () => {
    const { registry } = await deploy();
    const id = await create(registry);
    const a = await registry.getAgreement(id);
    expect(a.farmer1UserId).to.equal('user-ramesh');
    expect(a.status).to.equal(1); // PendingSignature
    expect(await registry.partyIdOf('user-ramesh')).to.equal(ethers.keccak256(ethers.toUtf8Bytes('user-ramesh')));
    expect(await registry.getPartyAgreements('user-lakshmi')).to.deep.equal([id]);
  });

  it('activates only after both parties sign, and rejects double / foreign signatures', async () => {
    const { registry } = await deploy();
    const id = await create(registry);
    await registry.signAgreement(id, 'user-ramesh');
    await expect(registry.signAgreement(id, 'user-ramesh')).to.be.revertedWithCustomError(registry, 'AlreadySigned');
    await expect(registry.signAgreement(id, 'user-mallory')).to.be.revertedWithCustomError(registry, 'NotAParty');
    await registry.signAgreement(id, 'user-lakshmi');
    expect((await registry.getAgreement(id)).status).to.equal(2); // Active
  });

  it('only relayers can write', async () => {
    const { registry, stranger } = await deploy();
    await expect(registry.connect(stranger).createAgreement(await params()))
      .to.be.revertedWithCustomError(registry, 'NotRelayer');
  });

  it('validates terms', async () => {
    const { registry } = await deploy();
    await expect(create(registry, { farmer2SharePercent: 50 })).to.be.revertedWithCustomError(registry, 'InvalidShares');
    await expect(create(registry, { farmer2UserId: 'user-ramesh' })).to.be.revertedWithCustomError(registry, 'SameParty');
    await expect(create(registry, { farmer1Centiacres: 0 })).to.be.revertedWithCustomError(registry, 'InvalidLand');
    await expect(create(registry, { documentCid: '' })).to.be.revertedWithCustomError(registry, 'EmptyField');
    const now = await time.latest();
    await expect(create(registry, { startTimestamp: now - 10 * DAY, endTimestamp: now - DAY }))
      .to.be.revertedWithCustomError(registry, 'InvalidPeriod');
  });

  it('gives unique IDs to identical agreements in the same block', async () => {
    const { registry } = await deploy();
    const a = await create(registry);
    const b = await create(registry);
    expect(a).to.not.equal(b);
  });

  it('reports Expired after the end date and blocks signing', async () => {
    const { registry } = await deploy();
    const id = await create(registry);
    await time.increase(366 * DAY);
    expect(await registry.getAgreementStatus(id)).to.equal(3); // Expired
    await expect(registry.signAgreement(id, 'user-ramesh')).to.be.revertedWithCustomError(registry, 'NotPending');
  });

  it('lets a party revoke, but not an outsider', async () => {
    const { registry } = await deploy();
    const id = await create(registry);
    await expect(registry.revokeAgreement(id, 'user-x', 'no')).to.be.revertedWithCustomError(registry, 'NotAParty');
    await registry.revokeAgreement(id, 'user-lakshmi', 'changed mind');
    expect((await registry.getAgreement(id)).status).to.equal(4); // Revoked
    await expect(registry.signAgreement(id, 'user-ramesh')).to.be.revertedWithCustomError(registry, 'NotPending');
  });

  it('verifies the stored IPFS document CID', async () => {
    const { registry } = await deploy();
    const id = await create(registry);
    const p = await params();
    expect(await registry.verifyDocumentCid(id, p.documentCid)).to.equal(true);
    expect(await registry.verifyDocumentCid(id, 'bafy-tampered')).to.equal(false);
  });

  it('supports relayer rotation and emergency pause', async () => {
    const { registry, owner, relayer2 } = await deploy();
    await registry.setRelayer(relayer2.address, true);
    await create(registry.connect(relayer2));
    await registry.setRelayer(owner.address, false); // leaked key revoked
    await expect(create(registry)).to.be.revertedWithCustomError(registry, 'NotRelayer');

    await registry.setPaused(true);
    await expect(create(registry.connect(relayer2))).to.be.revertedWithCustomError(registry, 'ContractPaused');
  });

  it('uses two-step ownership transfer', async () => {
    const { registry, newOwner, stranger } = await deploy();
    await registry.transferOwnership(newOwner.address);
    await expect(registry.connect(stranger).acceptOwnership()).to.be.revertedWithCustomError(registry, 'NotOwner');
    await registry.connect(newOwner).acceptOwnership();
    expect(await registry.owner()).to.equal(newOwner.address);
  });
});
