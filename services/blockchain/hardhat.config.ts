import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.24',
    settings: {
      optimizer: { enabled: true, runs: 1 },
      evmVersion: 'paris',
      viaIR: true,
    },
  },
  networks: {
    hardhat: { chainId: 31337 },
    // Polygon Amoy Testnet
    amoy: {
      url: process.env.BLOCKCHAIN_RPC_URL ?? 'https://rpc-amoy.polygon.technology/',
      accounts: process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY
        ? [process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY]
        : [],
      chainId: 80002,
      gasPrice: 30000000000, // 30 gwei to fit within 0.1 MATIC
    },
    // Polygon Mainnet
    polygon: {
      url: 'https://polygon-rpc.com',
      accounts: process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY
        ? [process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY]
        : [],
      chainId: 137,
      gasPrice: 'auto',
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY ?? '',
      polygon: process.env.POLYGONSCAN_API_KEY ?? '',
    },
    customChains: [
      {
        network: 'polygonAmoy',
        chainId: 80002,
        urls: {
          apiURL: 'https://api-amoy.polygonscan.com/api',
          browserURL: 'https://amoy.polygonscan.com/',
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;
