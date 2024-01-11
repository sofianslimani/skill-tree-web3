require("@nomicfoundation/hardhat-toolbox");
const dotenv = require("dotenv");

const env = dotenv.config().parsed;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: env?.ALCHEMY_BASE_URL,
      accounts: ['0x' + env?.METAMASK_PRIVATE_KEY]
    },
  }
};
