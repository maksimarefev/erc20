const hardhat = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const initialSupply = 0;

  console.log("Deploying contracts with the account:", deployer.address);

  const MySimpleToken = await hardhat.ethers.getContractFactory("MySimpleToken");
  const mySimpleToken = await MySimpleToken.deploy(initialSupply);

  await mySimpleToken.deployed();

  console.log("MySimpleToken deployed to:", mySimpleToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });