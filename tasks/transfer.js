require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
const { task } = require('hardhat/config');

task("transfer", "Transfers `tokens` amount of tokens to address `to` and fires the Transfer event.")
    .addParam("to", "Destination address")
    .addParam("tokens", "Amount of tokens to transfer")
    .setAction(async function (taskArgs) {
        const MySimpleToken = await ethers.getContractFactory("MySimpleToken");
        const mySimpleToken = await MySimpleToken.attach(taskArgs.contractAddress);

        await mySimpleToken.transfer(taskArgs.to, taskArgs.tokens);
    });