const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MySimpleToken", function () {
    const initialSupply = 1000000;
    let MySimpleToken;
    let alice;
    let bob;
    let hardhatMySimpleToken;

    beforeEach(async function () {
        [alice, bob] = await ethers.getSigners();
        MySimpleToken = await ethers.getContractFactory("MySimpleToken");
        hardhatMySimpleToken = await MySimpleToken.deploy(initialSupply);
    })

    function assertTransferEvent(event, from, to, value) {
        expect("Transfer").to.equal(event.event);
        expect(from).to.equal(event.args.from);
        expect(to).to.equal(event.args.to);
        expect(value).to.equal(event.args.tokens.toNumber());
    }

    function assertApprovalEvent(event, tokenOwner, spender, value) {
        expect("Approval").to.equal(event.event);
        expect(tokenOwner).to.equal(event.args.tokenOwner);
        expect(spender).to.equal(event.args.spender);
        expect(value).to.equal(event.args.tokens.toNumber());
    }

    it("Should not allow a non-minter to mint tokens", async () => {
        const bobAddress = await bob.getAddress();

        try {
            await hardhatMySimpleToken.connect(bob).mint(bobAddress, 10);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'Only the minter is allowed to perform that operation'")
                .to.equal(error.message);
        }
    })

    it("Should allow the minter to mint tokens", async () => {
        const tokensToMint = 100;
        const bobAddress = await bob.getAddress();
        const balanceOfBobBeforeMinting = await hardhatMySimpleToken.balanceOf(bobAddress);
        const totalSupplyBeforeMinting = await hardhatMySimpleToken.totalSupply();

        const mintTx = await hardhatMySimpleToken.mint(bobAddress, tokensToMint);
        const mintTxReceipt = await mintTx.wait();

        expect(1, mintTxReceipt.events.length)
        assertTransferEvent(mintTxReceipt.events[0], ethers.constants.AddressZero, bobAddress, tokensToMint);
        const balanceOfBobAfterMinting = await hardhatMySimpleToken.balanceOf(bobAddress);
        const totalSupplyAfterMinting = await hardhatMySimpleToken.totalSupply();
        expect(tokensToMint).to.equal(balanceOfBobAfterMinting - balanceOfBobBeforeMinting);
        expect(tokensToMint).to.equal(totalSupplyAfterMinting - totalSupplyBeforeMinting);
    })

    it("Should allow to burn owned tokens", async () => {
        const amountToBurn = 100;
        const aliceAddress = await alice.getAddress();
        const balanceOfAliceBeforeBurning = await hardhatMySimpleToken.balanceOf(aliceAddress);

        const burnTx = await hardhatMySimpleToken.burn(amountToBurn);
        const burnTxReceipt = await burnTx.wait();

        expect(1, burnTxReceipt.events.length);
        assertTransferEvent(burnTxReceipt.events[0], aliceAddress, ethers.constants.AddressZero, amountToBurn);
        const balanceOfAliceAfterBurning = await hardhatMySimpleToken.balanceOf(aliceAddress);
        expect(balanceOfAliceBeforeBurning.toNumber() - amountToBurn).to.equal(balanceOfAliceAfterBurning.toNumber());
    })

    it("Should allow to transfer approved tokens", async () => {
        const amountToTransfer = 100;
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();
        const balanceOfAliceBeforeTransfer = await hardhatMySimpleToken.balanceOf(aliceAddress);
        const balanceOfBobBeforeTransfer = await hardhatMySimpleToken.balanceOf(bobAddress);

        const approveTx = await hardhatMySimpleToken.approve(bobAddress, amountToTransfer);
        const approveTxReceipt = await approveTx.wait();
        const transferTx = await hardhatMySimpleToken.connect(bob).transferFrom(aliceAddress, bobAddress, amountToTransfer);
        const transferTxReceipt = await transferTx.wait();

        expect(1).to.equal(approveTxReceipt.events.length);
        assertApprovalEvent(approveTxReceipt.events[0], aliceAddress, bobAddress, amountToTransfer);
        expect(1).to.equal(transferTxReceipt.events.length);
        assertTransferEvent(transferTxReceipt.events[0], aliceAddress, bobAddress, amountToTransfer);
        const balanceOfAliceAfterTransfer = await hardhatMySimpleToken.balanceOf(aliceAddress);
        const balanceOfBobAfterTransfer = await hardhatMySimpleToken.balanceOf(bobAddress);
        expect(balanceOfAliceBeforeTransfer.toNumber() - amountToTransfer)
            .to.equal(balanceOfAliceAfterTransfer.toNumber(), "Alice' balance should have decreased by " + amountToTransfer + " after transfer")
        expect(balanceOfBobBeforeTransfer.toNumber() + amountToTransfer)
            .to.equal(balanceOfBobAfterTransfer.toNumber(), "Bob's balance should have increased by " + amountToTransfer + " after transfer");
    })

    it("Should allow to transfer owned tokens", async () => {
        const amountToTransfer = 100;
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();
        const balanceOfAliceBeforeTransfer = await hardhatMySimpleToken.balanceOf(aliceAddress);
        const balanceOfBobBeforeTransfer = await hardhatMySimpleToken.balanceOf(bobAddress);

        const transferTx = await hardhatMySimpleToken.transfer(bobAddress, amountToTransfer);
        const transferTxReceipt = await transferTx.wait();

        expect(1, transferTxReceipt.events.length);
        assertTransferEvent(transferTxReceipt.events[0], aliceAddress, bobAddress, amountToTransfer);
        const balanceOfAliceAfterTransfer = await hardhatMySimpleToken.balanceOf(aliceAddress);
        const balanceOfBobAfterTransfer = await hardhatMySimpleToken.balanceOf(bobAddress);
        expect(balanceOfAliceBeforeTransfer.toNumber() - amountToTransfer)
            .to.equal(balanceOfAliceAfterTransfer.toNumber(), "Alice' balance should have decreased by " + amountToTransfer + " after transfer");
        expect(balanceOfBobBeforeTransfer.toNumber() + amountToTransfer)
            .to.equal(balanceOfBobAfterTransfer.toNumber(), "Bob's balance should have increased by " + amountToTransfer + " after transfer");
    })

    it("Should not allow to transfer insufficient amount of tokens", async () => {
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();
        const balanceOfAlice = await hardhatMySimpleToken.balanceOf(aliceAddress);
        const amountToTransfer = balanceOfAlice + 1;

        try {
            await hardhatMySimpleToken.transfer(bobAddress, amountToTransfer);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'Sender account does not hold sufficient balance'")
                .to.equal(error.message, "Invalid error message");
        }
    })

    it("Should not allow to transferFrom insufficient amount of tokens", async () => {
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();
        const balanceOfAlice = await hardhatMySimpleToken.balanceOf(aliceAddress);
        const amountToTransfer = balanceOfAlice.toNumber() + 1;

        try {
            await hardhatMySimpleToken.transferFrom(aliceAddress, bobAddress, amountToTransfer);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'Source address does not hold sufficient balance'")
                .to.equal(error.message, "Invalid error message");
        }
    })

    it("Should not allow to mint tokens on zero address", async () => {
        try {
            await hardhatMySimpleToken.mint(ethers.constants.AddressZero, 10);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'Minting to zero address is not allowed'")
                .to.equal(error.message);
        }
    })

    it("Should not allow to overflow total supply", async () => {
        const aliceAddress = await alice.getAddress();

        try {
            await hardhatMySimpleToken.mint(aliceAddress, ethers.constants.MaxUint256);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with panic code 0x11 (Arithmetic operation underflowed or overflowed outside of an unchecked block)")
                .to.equal(error.message);
        }
    })

    it("Should not allow to burn more tokens than a caller posesses", async () => {
        const aliceAddress = await alice.getAddress();
        const aliceBalance = await hardhatMySimpleToken.balanceOf(aliceAddress);
        const tokensToBurn = aliceBalance.toNumber() + 1;
        
        try {
            await hardhatMySimpleToken.burn(tokensToBurn);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'The caller does not hold sufficient amount of tokens'")
                .to.equal(error.message);
        }
    })

    it("Should not allow to transferFrom if the source address does not hold sufficient amount of tokens", async () => {
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();
        const bobBalance = await hardhatMySimpleToken.balanceOf(bobAddress);
        const amountToTransfer = bobBalance.toNumber() + 1;

        try {
            await hardhatMySimpleToken.transferFrom(bobAddress, aliceAddress, amountToTransfer);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'Source address does not hold sufficient balance'")
                .to.equal(error.message, "Invalid error message");
        }
    })

    it("Should not allow to transferFrom if the source address does not hold sufficient amount of tokens", async () => {
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();
        await hardhatMySimpleToken.mint(bobAddress, 1);
        const bobToAliceAllowance = await hardhatMySimpleToken.allowance(bobAddress, aliceAddress);
        const amountToTransfer = bobToAliceAllowance.toNumber() + 1;

        try {
            await hardhatMySimpleToken.transferFrom(bobAddress, aliceAddress, amountToTransfer);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'The caller is not allowed to transfer that amount of tokens'")
                .to.equal(error.message, "Invalid error message");
        }
    })

    it("Should allow to transfer 0 tokens", async () => {
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();

        const transferTx = await hardhatMySimpleToken.transfer(bobAddress, 0);
        const transferTxReceipt = await transferTx.wait();

        expect(1, transferTxReceipt.events.length)
        assertTransferEvent(transferTxReceipt.events[0], aliceAddress, bobAddress, 0);
    })

    it("Should allow to transferFrom 0 tokens", async () => {
        const aliceAddress = await alice.getAddress();
        const bobAddress = await bob.getAddress();

        const transferTx = await hardhatMySimpleToken.transferFrom(bobAddress, aliceAddress, 0);
        const transferTxReceipt = await transferTx.wait();

        expect(1, transferTxReceipt.events.length)
        assertTransferEvent(transferTxReceipt.events[0], bobAddress, aliceAddress, 0);
    })

    it("Should not allow to transfer to the zero address", async () => {
        try {
            await hardhatMySimpleToken.transfer(ethers.constants.AddressZero, 0);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'Transfer to the zero address is not allowed'")
                .to.equal(error.message, "Invalid error message");
        }
    })

    it("Should not allow to transferFrom to the zero address", async () => {
        const bobAddress = await bob.getAddress();

        try {
            await hardhatMySimpleToken.transferFrom(bobAddress, ethers.constants.AddressZero, 0);
        } catch (error) {
            expect("VM Exception while processing transaction: reverted with reason string 'Transfer to the zero address is not allowed'")
                .to.equal(error.message, "Invalid error message");
        }
    })

    it("Should return valid minter", async () => {
        const aliceAddress = await alice.getAddress();

        const minter = await hardhatMySimpleToken.minter();

        expect(aliceAddress).to.equal(minter);
    })

    it("Should return valid name", async () => {
        const name = await hardhatMySimpleToken.name();

        expect("MySimpleToken").to.equal(name);
    })

    it("Should return valid symbol", async () => {
        const symbol = await hardhatMySimpleToken.symbol();

        expect("MST").to.equal(symbol);
    })

    it("Should return valid decimals", async () => {
        const decimals = await hardhatMySimpleToken.decimals();

        expect(18).to.equal(decimals);
    })
});
