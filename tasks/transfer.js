require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
const { task } = require('hardhat/config');

task("transfer", "Transfers `tokens` amount of tokens to address `to` and fires the Transfer event.")
    .addParam("contractAddress", "An address of a contract")
    .addParam("to", "Destination address")
    .addParam("tokens", "Amount of tokens to transfer")
    .setAction(async function (taskArgs) {
        const MySimpleToken = await ethers.getContractFactory("MySimpleToken");
        const mySimpleToken = await MySimpleToken.attach(taskArgs.contractAddress);

        const transferTx = await mySimpleToken.transfer(taskArgs.to, taskArgs.tokens);
        const transferTxReceipt = await transferTx.wait();
        const transferEvent = transferTxReceipt.events[0];
        console.log(
            "Successfully transferred %d tokens from %s to %s",
            transferEvent.args.tokens.toNumber(),
            transferEvent.args.from,
            transferEvent.args.to
        );
        console.log("Gas used: %d", transferTxReceipt.gasUsed.toNumber() * transferTxReceipt.effectiveGasPrice.toNumber());
    });