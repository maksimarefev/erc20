require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
const { task } = require('hardhat/config');

task("transferFrom", "Transfers `tokens` amount of tokens from address `from` to address `to` and fires the Transfer event.")
    .addParam("from", "Source address")
    .addParam("to", "Destination address")
    .addParam("tokens", "Amount of tokens to transfer")
    .setAction(async function (taskArgs) {
        const MySimpleToken = await ethers.getContractFactory("MySimpleToken");
        const mySimpleToken = await MySimpleToken.attach(taskArgs.contractAddress);

        await mySimpleToken.transferFrom(taskArgs.from, taskArgs.to, taskArgs.tokens);
    });
