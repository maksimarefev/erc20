require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
const { task } = require('hardhat/config');

task("approve", "Allows `spender` to withdraw from caller's account multiple times, up to the `tokens` amount.")
    .addParam("spender", "Address which should receive an approval to spend caller's tokens")
    .addParam("tokens", "Amount of tokens to transfer")
    .setAction(async function (taskArgs) {
        const MySimpleToken = await ethers.getContractFactory("MySimpleToken");
        const mySimpleToken = await MySimpleToken.attach(taskArgs.contractAddress);

        await mySimpleToken.transferFrom(taskArgs.spender, taskArgs.tokens);
    });
