import 'solidity-coverage';
import "./tasks/approve.ts";
import "./tasks/transfer.ts";
import "./tasks/transferFrom.ts";
import "@nomiclabs/hardhat-etherscan";
import { HardhatUserConfig } from "hardhat/config";
import { PRIVATE_KEY, INFURA_API_KEY, ETHERSCAN_API_KEY } from './secret.json';

const config: HardhatUserConfig = {
    solidity: "0.8.0",
    networks: {
        rinkeby: {
          url: "https://rinkeby.infura.io/v3/" + INFURA_API_KEY,
          accounts: [`0x${PRIVATE_KEY}`]
        },
        kovan: {
            url: "https://kovan.infura.io/v3/" + INFURA_API_KEY,
            accounts: [`0x${PRIVATE_KEY}`]
        }
    },
    etherscan: {
        apiKey: {
          rinkeby: ETHERSCAN_API_KEY,
          kovan: ETHERSCAN_API_KEY
        }
    }
};

export default config;