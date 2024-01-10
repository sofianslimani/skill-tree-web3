const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SkillTree", function () {
    async function deploySkillTree() {
        const [owner, user1, user2] = await ethers.getSigners();
        const SkillTree = await ethers.getContractFactory("SkillTree");
        const skillTree = await SkillTree.deploy();
        await skillTree.waitForDeployment();
        return { skillTree, owner, user1, user2 };
    }

    describe("Deployment", function () {
        it("Should deploy without failing", async function () {
            const { skillTree } = await deploySkillTree();
            expect(skillTree).to.not.equal(undefined);
        });
    });

    describe("User Management", function () {
        it('Should exclude the caller from the user list', async function () {
            const { skillTree, owner, user1, user2 } = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            await skillTree.addUser(user2.address, "User2FirstName", "User2LastName");

            const users = await skillTree.listUsers();
            expect(users).to.not.include(owner.address);
        });

        it('Should include all other users except the caller', async function () {
            const { skillTree, user1, user2 } = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            await skillTree.addUser(user2.address, "User2FirstName", "User2LastName");

            const users = await skillTree.listUsers();
            expect(users).to.include(user1.address);
            expect(users).to.include(user2.address);
            expect(users.length).to.equal(2);
        });
    });

    describe("Skills", function () {
        it("Should list the users skills", async function () {
            const { skillTree, owner } = await deploySkillTree();
            const skills = await skillTree.getUserSkills(owner.address);
            expect(skills).to.eql([]);
        });

        it("Should add a skill to the user", async function () {
            const { skillTree, owner } = await deploySkillTree();
            await skillTree.addSkill('javascript', 3);
            const skills = await skillTree.getUserSkills(owner.address)
            expect(skills).to.eql([['javascript', BigInt(3), []]]);
        });

        it('should fail to add a skill if the skill level is <0 or >5', async function () {
            const { skillTree, owner } = await deploySkillTree();
            async function addSkill(skill, level) {
                return await skillTree.addSkill(skill, level);
            }
            await expect(addSkill('javascript', -1)).to.be.rejected;
            await expect(addSkill('javascript', 0)).to.be.revertedWith('Skill level must be between 1 and 5');
            await expect(addSkill('javascript', 6)).to.be.revertedWith('Skill level must be between 1 and 5');
            const skills = await skillTree.getUserSkills(owner.address);
            expect(skills).to.eql([]);
        });
    });


    describe('SkillValidation', function () {
      it('should validate a skill', async function () {
            const {skillTree, owner, user1} = await deploySkillTree();
            await skillTree.connect(owner).addSkill('javascript', 3);
            await skillTree.connect(user1).addSkillValidation(owner.address, 0);
            const skills = await skillTree.getUserSkills(owner.address)
            expect(skills).to.eql([['javascript', BigInt(3), [[user1.address, BigInt(0)]]]]);
      })
        it('should only return the validation for the corresponding skill', async function () {
            const {skillTree, owner, user1} = await deploySkillTree();
            await skillTree.connect(owner).addSkill('javascript', 3);
            await skillTree.connect(owner).addSkill('javascript', 4);
            await skillTree.connect(user1).addSkillValidation(owner.address, 0);
            await skillTree.connect(user1).addSkillValidation(owner.address, 1);
            const skills = await skillTree.getUserSkills(owner.address)
            expect(skills).to.eql([
                ['javascript', BigInt(3), [[user1.address, BigInt(0)]]],
                ['javascript', BigInt(4), [[user1.address, BigInt(1)]]]
            ]);
        })
        it('should fail to validate a skill if the skill does not exist', async function () {
            const {skillTree, owner, otherAccount} = await deploySkillTree();
            await expect(skillTree.connect(otherAccount).addSkillValidation(owner.address, 0)).to.be.revertedWith('Skill does not exist');
        })
        it('should fail to validate a skill if the user try to validate his own skills', async function () {
            const {skillTree, owner, otherAccount} = await deploySkillTree();
            await skillTree.addSkill('javascript', 3);
            async function addSkillValidation() {
                return await skillTree.addSkillValidation(owner.address, 0);
            }
            expect(addSkillValidation()).to.be.revertedWith('You cannot validate your own skills');
        })
    })
});
