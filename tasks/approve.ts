import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-ethers";
import { task } from 'hardhat/config';
import { Contract, ContractFactory, Event } from "ethers";

task("approve", "Allows `spender` to withdraw from caller's account multiple times, up to the `tokens` amount.")
    .addParam("contractAddress", "An address of a contract")
    .addParam("spender", "Address which should receive an approval to spend caller's tokens")
    .addParam("tokens", "Amount of tokens to transfer")
    .setAction(async function (taskArgs, hre) {
        const MySimpleToken: ContractFactory = await hre.ethers.getContractFactory("MySimpleToken");
        const mySimpleToken: Contract = await MySimpleToken.attach(taskArgs.contractAddress);

        const approveTx = await mySimpleToken.approve(taskArgs.spender, taskArgs.tokens);
        const approveTxReceipt = await approveTx.wait();
        const approveEvent: Event = approveTxReceipt.events[0];

        console.log(
            "Successfully approved for %s transferring %d tokens from %s",
            approveEvent.args.spender,
            approveEvent.args.tokens.toNumber(),
            approveEvent.args.tokenOwner
        );
        console.log("Gas used: %d", approveTxReceipt.gasUsed.toNumber() * approveTxReceipt.effectiveGasPrice.toNumber());
    });
