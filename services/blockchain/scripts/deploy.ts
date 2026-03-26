import { ethers } from 'hardhat';
import fs from 'fs';
import path from 'path';

/**
 * Deployment script for LandAgreementRegistry on Polygon Amoy testnet.
 * BUG-016 fix: single authoritative deploy script.
 * Run: npx hardhat run scripts/deploy.ts --network amoy
 */
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('🚀 Deploying LandAgreementRegistry...');
  console.log('   Network:', (await ethers.provider.getNetwork()).name);
  console.log('   Deployer:', deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log('   Balance:', ethers.formatEther(balance), 'MATIC');

  if (balance === 0n) {
    throw new Error('Deployer wallet has 0 balance. Fund from https://faucet.polygon.technology/');
  }

  // Deploy
  const ContractFactory = await ethers.getContractFactory('LandAgreementRegistry');
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const deployTx = contract.deploymentTransaction();
  
  console.log('\n✅ Deployed successfully!');
  console.log('   Contract Address:', contractAddress);
  console.log('   Tx Hash:', deployTx?.hash);
  console.log('   Block:', deployTx?.blockNumber);

  // Save deployment info
  const deploymentInfo = {
    contractAddress,
    network: (await ethers.provider.getNetwork()).name,
    chainId: Number((await ethers.provider.getNetwork()).chainId),
    deployedAt: new Date().toISOString(),
    deployedBy: deployer.address,
    txHash: deployTx?.hash,
  };

  const outDir = path.join(__dirname, '../deployments');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    path.join(outDir, 'deployment.json'),
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log('\n📄 Deployment info saved to services/blockchain/deployments/deployment.json');
  console.log('\n📋 Next steps:');
  console.log('   1. Copy contract address to .env: BLOCKCHAIN_CONTRACT_ADDRESS=' + contractAddress);
  console.log('   2. Verify on PolygonScan: npx hardhat verify --network amoy', contractAddress);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
