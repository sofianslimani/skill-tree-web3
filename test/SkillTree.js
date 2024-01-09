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
        })
    });


});
