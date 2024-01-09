const {expect} = require("chai");

describe("SkillTree", function () {
    async function deploySkillTree() {
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const SkillTree = await ethers.getContractFactory("SkillTree");
        const lock = await SkillTree.deploy();

        return {lock, owner, otherAccount};
    }

    describe("Deployment", function () {
        it("Should deploy without failing", async function () {
            const {lock, owner} = await deploySkillTree();
            expect(lock).to.not.equal(undefined);
        });
    });

});
