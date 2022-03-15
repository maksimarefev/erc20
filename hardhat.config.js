//require('dotenv').config();
require('solidity-coverage');
require("./tasks/approve.js");
require("./tasks/transfer.js");
require("./tasks/transferFrom.js");

/*const PRIVATE_KEY = process.env.PRIVATE_KEY;
const INFURA_API_KEY = process.env.INFURA_API_KEY;*/

module.exports = {
    solidity: "0.8.0",
/*    networks: {
      kovan: {
        url: "https://kovan.infura.io/v3/" + INFURA_API_KEY,
        accounts: [`0x${PRIVATE_KEY}`]
      }
    },
    paths: {
        sources: "./contracts",
        tests: "./test",
        cache: "./cache",
        artifacts: "./artifacts"
    }*/
};