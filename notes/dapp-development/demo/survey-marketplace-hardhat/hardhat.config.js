require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");
require("solidity-coverage");

require("dotenv").config();

const SKIP_LOAD = process.env.SKIP_LOAD === "true";
const mnemonic = process.env.MNEMONIC;
const etherscanAPI = process.env.ETHERSCAN_KEY;
const infuraKey = process.env.INFURA_KEY;

// tasks
if (!SKIP_LOAD) {
  require("./tasks/accounts");
  require("./tasks/deploy-surveyfactory");
  require("./tasks/create-survey");
}

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts: { mnemonic },
    },
    localhost: {
      chainId: 1337,
      accounts: { mnemonic },
      url: "http://localhost:8545",
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${infuraKey}`,
      accounts: { mnemonic },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: etherscanAPI,
  },
};
