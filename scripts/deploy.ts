import { ethers } from "hardhat";
import { Signer, Contract, ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
  const initialSupply: number = 0;
  const accounts: SignerWithAddress[] = await ethers.getSigners();

  if (accounts.length == 0) {
    throw new Error('No accounts were provided');
  }

  console.log("Deploying contracts with the account:", accounts[0].address);

  const MySimpleToken: ContractFactory = await ethers.getContractFactory("MySimpleToken");
  const mySimpleToken: Contract = await MySimpleToken.deploy(initialSupply);

  await mySimpleToken.deployed();

  console.log("MySimpleToken deployed to:", mySimpleToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });