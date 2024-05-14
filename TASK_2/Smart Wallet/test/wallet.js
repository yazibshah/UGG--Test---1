// test/wallet.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Wallet", function () {
    let Wallet;
    let wallet;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        wallet = await ethers.deployContract("Wallet");
        
    });

    it("Should set the owner as the deployer", async function () {
        expect(await wallet.owner()).to.equal(owner.address);
    });

    it("Should deposit funds into the wallet", async function () {
        const amount = ethers.parseEther("1");
        await wallet.deposit({ value: amount });
        expect(await wallet.balances(owner.address)).to.equal(amount);
    });

    it("Should withdraw funds from the wallet", async function () {
        const initialBalance = ethers.parseEther("2");
        const withdrawalAmount = ethers.parseEther("1");
        await wallet.deposit({ value: initialBalance });
        await wallet.withdraw(withdrawalAmount);
        expect(await wallet.balances(owner.address)).to.equal(withdrawalAmount);
    });

    it("Should add an authorized user", async function () {
        await wallet.addAuthorizedUser(addr1.address);
        expect(await wallet.authorizedUsers(addr1.address)).to.equal(true);
    });

    it("Should remove an authorized user", async function () {
        await wallet.addAuthorizedUser(addr1.address);
        await wallet.removeAuthorizedUser(addr1.address);
        expect(await wallet.authorizedUsers(addr1.address)).to.equal(false);
    });

    it("Should revert withdrawal if the amount is 0", async function () {
        await expect(wallet.withdraw(0)).to.be.revertedWith("Withdrawal amount must be greater than 0");
    });

    it("Should revert deposit if the amount is 0", async function () {
        await expect(wallet.deposit({ value: 0 })).to.be.revertedWith("Deposit amount must be greater than 0");
    });

    it("Should revert addAuthorizedUser if caller is not the owner", async function () {
        await expect(wallet.connect(addr1).addAuthorizedUser(addr2.address))
            .to.be.revertedWith("Only owner can call this function");
    });

    it("Should revert removeAuthorizedUser if caller is not the owner", async function () {
        await wallet.addAuthorizedUser(addr1.address);
        await expect(wallet.connect(addr1).removeAuthorizedUser(addr2.address))
            .to.be.revertedWith("Only owner can call this function");
    });
});
