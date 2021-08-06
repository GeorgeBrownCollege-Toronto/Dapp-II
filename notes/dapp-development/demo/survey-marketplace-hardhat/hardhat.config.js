require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-solhint");
require("@nomiclabs/hardhat-etherscan");


require("dotenv").config();

// tasks
require("./tasks/accounts");
require("./tasks/deploy-surveyfactory")
require("./tasks/create-survey");

const mnemonic = process.env.MNEMONIC;
const etherscanAPI = process.env.ETHERSCAN_KEY

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
  defaultNetwork:"hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      accounts:{mnemonic}
    },
    localhost: {
      chainId: 1337,
      accounts:{mnemonic},
      url:"http://localhost:8545"
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${process.env.INFURA_TOKEN}`,
      accounts: { mnemonic }
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: etherscanAPI
  }
};
