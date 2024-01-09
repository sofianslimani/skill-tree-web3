const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillTree Contract", function () {
    let SkillTree;
    let owner, user1, user2;

    before(async function () {
        [owner, user1, user2] = await ethers.getSigners();
        SkillTree = await ethers.getContractFactory("SkillTree");
    });

    it('Should exclude the caller from the user list', async function () {
        const skillTree = await SkillTree.deploy();
        await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
        await skillTree.addUser(user2.address, "User2FirstName", "User2LastName");

        // Get the list of users
        const users = await skillTree.listUsers();
        expect(users).to.not.include(owner.address);
    });

    it('Should include all other users except the caller', async function () {
        // Deploy the contract
        const skillTree = await SkillTree.deploy();
        await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
        await skillTree.addUser(user2.address, "User2FirstName", "User2LastName");


        const users = await skillTree.listUsers();
        expect(users).to.include(user1.address);
        expect(users).to.include(user2.address);
        expect(users.length).to.equal(2);
    });
});
