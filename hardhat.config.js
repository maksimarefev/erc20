require('solidity-coverage');
require("./tasks/approve.js");
require("./tasks/transfer.js");
require("./tasks/transferFrom.js");
require("@nomiclabs/hardhat-etherscan");
const { PRIVATE_KEY, INFURA_API_KEY, ETHERSCAN_API_KEY } = require('./secret.json');

module.exports = {
    solidity: "0.8.0",
    networks: {
      rinkeby: {
        url: "https://rinkeby.infura.io/v3/" + INFURA_API_KEY,
        accounts: [`0x${PRIVATE_KEY}`]
      }
    },
    etherscan: {
        apiKey: {
            rinkeby: ETHERSCAN_API_KEY
        }
    }
};