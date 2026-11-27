import { ethers, network } from 'hardhat';
import fs from 'fs';
import path from 'path';

/**
 * Deploy LandAgreementRegistry (v2).
 *
 *   Free testnet:  pnpm --filter @agrilink/blockchain deploy:amoy
 *   Local node:    npx hardhat node  &&  pnpm --filter @agrilink/blockchain deploy:local
 *
 * Optional: EXTRA_RELAYERS=0xabc...,0xdef...  → extra relayer wallets (one per
 * blockchain-service replica, so replicas never fight over the same nonce).
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const net = await ethers.provider.getNetwork();

  console.log('🚀 Deploying LandAgreementRegistry v2');
  console.log('   Network :', network.name, `(chainId ${net.chainId})`);
  console.log('   Deployer:', deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('   Balance :', ethers.formatEther(balance), 'POL');
  if (balance === 0n) {
    throw new Error('Deployer has 0 balance. Get free Amoy POL from https://faucet.polygon.technology/');
  }

  const Factory = await ethers.getContractFactory('LandAgreementRegistry');
  const contract = await Factory.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const tx = contract.deploymentTransaction();
  const receipt = await tx?.wait();

  for (const r of (process.env.EXTRA_RELAYERS ?? '').split(',').map((s) => s.trim()).filter(Boolean)) {
    await (await contract.setRelayer(r, true)).wait();
    console.log('   + relayer', r);
  }

  const info = {
    contract: 'LandAgreementRegistry',
    version: 2,
    contractAddress: address,
    network: network.name,
    chainId: Number(net.chainId),
    deployedAt: new Date().toISOString(),
    deployedBy: deployer.address,
    txHash: tx?.hash,
    blockNumber: receipt?.blockNumber,
  };

  const outDir = path.join(__dirname, '../deployments');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, `${network.name}.json`), JSON.stringify(info, null, 2));

  console.log('\n✅ Deployed at', address);
  console.log(`   Saved deployments/${network.name}.json`);
  console.log('\nNext:');
  console.log('   1. .env → BLOCKCHAIN_CONTRACT_ADDRESS=' + address);
  if (network.name === 'amoy') {
    console.log('   2. Verify (free): npx hardhat verify --network amoy', address);
    console.log('   3. Explorer: https://amoy.polygonscan.com/address/' + address);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
