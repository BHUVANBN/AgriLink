import type { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '../../.env' });

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
    localhost: { url: 'http://127.0.0.1:8545', chainId: 31337 },
    // Polygon Amoy Testnet
    amoy: {
      url: process.env.BLOCKCHAIN_RPC_URL ?? 'https://rpc-amoy.polygon.technology/',
      accounts: process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY
        ? [process.env.BLOCKCHAIN_ADMIN_PRIVATE_KEY]
        : [],
      chainId: 80002,
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
