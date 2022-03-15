require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ethers");
const { task } = require('hardhat/config');

task("approve", "Allows `spender` to withdraw from caller's account multiple times, up to the `tokens` amount.")
    .addParam("contractAddress", "An address of a contract")
    .addParam("spender", "Address which should receive an approval to spend caller's tokens")
    .addParam("tokens", "Amount of tokens to transfer")
    .setAction(async function (taskArgs) {
        const MySimpleToken = await ethers.getContractFactory("MySimpleToken");
        const mySimpleToken = await MySimpleToken.attach(taskArgs.contractAddress);

        const approveTx = await mySimpleToken.approve(taskArgs.spender, taskArgs.tokens);
        const approveTxReceipt = await approveTx.wait();
        const approveEvent = approveTxReceipt.events[0];

        console.log(
            "Successfully approved for %s transferring %d tokens from %s",
            approveEvent.args.spender,
            approveEvent.args.tokens.toNumber(),
            approveEvent.args.tokenOwner
        );
        console.log("Gas used: %d", approveTxReceipt.gasUsed.toNumber() * approveTxReceipt.effectiveGasPrice.toNumber());
    });
