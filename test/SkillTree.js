const {expect} = require("chai");

describe("SkillTree", function () {
    async function deploySkillTree() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const SkillTree = await ethers.getContractFactory("SkillTree");
        const skillTree = await SkillTree.deploy();

        return {skillTree, owner, otherAccount};
    }

    describe("Deployment", function () {
        it("Should deploy without failing", async function () {
            const {skillTree} = await deploySkillTree();
            expect(skillTree).to.not.equal(undefined);
        });

    });

    describe("Skills", function () {
        it("Should list the users skills", async function () {
            const {skillTree, owner} = await deploySkillTree();
           const skills = await skillTree.getUserSkills(owner.address)
            expect(skills).to.eql([]);
        });
        it("Should add a skill to the user", async function () {
            const {skillTree, owner} = await deploySkillTree();
            await skillTree.addSkill('javascript', 3);
            const skills = await skillTree.getUserSkills(owner.address)
            expect(skills).to.eql([['javascript', BigInt(3)]]);
        });
        it('should fail to add a skill if the skill level is <0 or >5', async function () {
            const {skillTree, owner} = await deploySkillTree();
            async function addSkill(skill, level) {
                return await skillTree.addSkill(skill, level);
            }
            await expect(addSkill('javascript', -1)).to.be.rejected;
            await expect(addSkill('javascript', 0)).to.be.revertedWith('Skill level must be between 1 and 5');
            await expect(addSkill('javascript', 6)).to.be.revertedWith('Skill level must be between 1 and 5');
            const skills = await skillTree.getUserSkills(owner.address)
            expect(skills).to.eql([]);
        })
    });


});
