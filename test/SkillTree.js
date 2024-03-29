const {expect} = require("chai");
const {ethers} = require("hardhat");

function transformSkills(skills) {
    return skills.map(skill => ({
        name: skill.name,
        level: Number(skill.level),
        validations: skill.validations.map(validation => ({
            validator: {
                lastName: validation.validator.lastName,
                firstName: validation.validator.firstName,
            },
            validatorAddress: validation.validatorAddress,
            skillId: Number(validation.skillId)
        }))
    }));
}

function transformProfile(profile) {
    return {
        userAddress: profile.userAddress,
        lastName: profile.lastName,
        firstName: profile.firstName,
        skills: transformSkills(profile.skills)
    }
}

describe("SkillTree", function () {
    async function deploySkillTree() {
        const [owner, user1, user2] = await ethers.getSigners();
        const SkillTree = await ethers.getContractFactory("SkillTree");
        const skillTree = await SkillTree.deploy();
        await skillTree.waitForDeployment();
        return {skillTree, owner, user1, user2};
    }

    describe("Deployment", function () {
        it("Should deploy without failing", async function () {
            const {skillTree} = await deploySkillTree();
            expect(skillTree).to.not.equal(undefined);
        });
    });

    describe("User Management", function () {
        it('Should exclude the caller from the user list', async function () {
            const {skillTree, owner, user1, user2} = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            await skillTree.addUser(user2.address, "User2FirstName", "User2LastName");

            const users = await skillTree.listUsers();
            expect(users).to.not.include(owner.address);
        });

        it('Should include all other users except the caller', async function () {
            const {skillTree, user1, user2} = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            await skillTree.addUser(user2.address, "User2FirstName", "User2LastName");

            const users = await skillTree.listUsers();
            expect(users).to.include(user1.address);
            expect(users).to.include(user2.address);
            expect(users.length).to.equal(2);
        });

        it('Should add a user', async function () {
            const {skillTree, user1} = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            const users = await skillTree.listUsers();
            expect(users).to.include(user1.address);
        })

        it("Should not add the user if it already exist", async function () {
            const {skillTree, user1} = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            const users = await skillTree.listUsers();
            expect(users.length).to.equal(1);
        })

        it('should list the users profile', async function () {
            const {skillTree, owner, user1, user2} = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            await skillTree.addUser(user2.address, "User2FirstName", "User2LastName");
            const listProfiles = await skillTree.listProfiles();
            const transformedProfiles = listProfiles.map(transformProfile);
            expect(transformedProfiles).to.eql([
                {lastName: "User1LastName", firstName: "User1FirstName", skills: [], userAddress: user1.address},
                {lastName: "User2LastName", firstName: "User2FirstName", skills: [], userAddress: user2.address}
            ]);
        })

        it("should get the user profile", async function () {
            const {skillTree, owner, user1, user2} = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            const userProfile = await skillTree.getProfile(user1.address);
            const transformedProfile = transformProfile(userProfile);
            expect(transformedProfile).to.eql({
                lastName: "User1LastName",
                firstName: "User1FirstName",
                skills: [],
                userAddress: user1.address
            });
        })

        it('should handle existing and non-existing users correctly', async () => {
            const {skillTree, user1} = await deploySkillTree();
            const nonExistentAddress = '0x0000000000000000000000000000000000000000';

            async function getUser(address) {
                await skillTree.getUser(address)
            }

            expect(getUser(nonExistentAddress)).to.be.rejectedWith('User does not exist');
        });

        it('should edit the user profile', async function () {
            const {skillTree, owner} = await deploySkillTree();
            await skillTree.addUser(owner.address, "User2FirstName", "User2LastName");
            await skillTree.editProfile("LastName", "FirstName");
            const userProfile = await skillTree.getProfile(owner.address);
            const transformedProfile = transformProfile(userProfile);
            expect(transformedProfile).to.eql({
                lastName: "LastName",
                firstName: "FirstName",
                skills: [],
                userAddress: owner.address
            });
        })
    });

    describe("Skills", function () {
        it("Should list the users skills", async function () {
            const {skillTree, owner} = await deploySkillTree();
            const skills = await skillTree.getUserSkills(owner.address);
            expect(skills).to.eql([]);
        });

        it("Should add a skill to the user", async function () {
            const {skillTree, owner} = await deploySkillTree();
            await skillTree.addSkill('javascript', 3);
            const skills = await skillTree.getUserSkills(owner.address)
            const transformedSkills = transformSkills(skills);
            expect(transformedSkills).to.eqls([{
                name: 'javascript',
                level: 3,
                validations: []
            }]);
        });

        it('should fail to add a skill if the skill level is <0 or >5', async function () {
            const {skillTree, owner} = await deploySkillTree();

            async function addSkill(skill, level) {
                return await skillTree.addSkill(skill, level);
            }

            await expect(addSkill('javascript', -1)).to.be.rejected;
            await expect(addSkill('javascript', 0)).to.be.revertedWith('Skill level must be between 1 and 5');
            await expect(addSkill('javascript', 6)).to.be.revertedWith('Skill level must be between 1 and 5');
            const skills = await skillTree.getUserSkills(owner.address);
            expect(skills).to.eql([]);
        });

        it('should delete the skill and theses validation if it exist', async function () {
            const {skillTree, owner} = await deploySkillTree();
            await skillTree.addSkill('javascript', 3);
            await skillTree.deleteSkill(0);
            const skills = await skillTree.getUserSkills(owner.address);
            expect(skills).to.eql([]);
            const skillValidations = await skillTree.getUserSkillValidations(owner.address);
            expect(skillValidations).to.eql([]);
        })

        it('should fail to delete a skill if the skill does not exist', async function () {
            const {skillTree, owner} = await deploySkillTree();

            async function deleteSkill() {
                return await skillTree.deleteSkill(0);
            }

            await expect(deleteSkill()).to.be.revertedWith('Skill does not exist');
        })
        it("should edit a skill", async function () {
            const {skillTree, owner} = await deploySkillTree();
            await skillTree.addSkill('javascript', 3);
            await skillTree.editSkill(0, 'javascript', 4);
            const skills = await skillTree.getUserSkills(owner.address)
            expect(skills).to.eql([['javascript', BigInt(4), []]]);
        })

        it('should fail to edit a skill if the skill does not exist', async function () {
            const {skillTree, owner} = await deploySkillTree();

            async function editSkill() {
                return await skillTree.editSkill(0, 'javascript', 4);
            }

            await expect(editSkill()).to.be.revertedWith('Skill does not exist');
        })
    });


    describe('SkillValidation', function () {
        it('should validate a skill', async function () {
            const {skillTree, owner, user1} = await deploySkillTree();
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            await skillTree.connect(owner).addSkill('javascript', 3);
            await skillTree.connect(user1).addSkillValidation(owner.address, 0);
            const skills = await skillTree.getUserSkills(owner.address)
            const transformedSkills = transformSkills(skills);
            expect(transformedSkills).to.eqls([
                {
                    name: 'javascript',
                    level: 3,
                    validations: [{
                        validator: {lastName: "User1LastName", firstName: "User1FirstName"},
                        validatorAddress: user1.address,
                        skillId: 0
                    }]
                }
            ]);
        })
        it('should only return the validation for the corresponding skill', async function () {
            const {skillTree, owner, user1} = await deploySkillTree();
            await skillTree.connect(owner).addSkill('javascript', 3);
            await skillTree.connect(owner).addSkill('javascript', 4);
            await skillTree.addUser(user1.address, "User1FirstName", "User1LastName");
            await skillTree.connect(user1).addSkillValidation(owner.address, 0);
            await skillTree.connect(user1).addSkillValidation(owner.address, 1);
            const skills = await skillTree.getUserSkills(owner.address)
            const transformedSkills = transformSkills(skills);
            expect(transformedSkills[0]).to.eqls({
                name: 'javascript',
                level: 3,
                validations: [{
                    validator: {lastName: "User1LastName", firstName: "User1FirstName"},
                    validatorAddress: user1.address,
                    skillId: 0
                }]
            });
            expect(transformedSkills[1]).to.eqls({
                name: 'javascript',
                level: 4,
                validations: [{
                    validator: {lastName: "User1LastName", firstName: "User1FirstName"},
                    validatorAddress: user1.address,
                    skillId: 1
                }]
            });
            expect(transformedSkills.length).to.equal(2);
        })
        it('should fail to validate a skill if the skill does not exist', async function () {
            const {skillTree, owner, user1} = await deploySkillTree();
            await expect(skillTree.connect(user1).addSkillValidation(owner.address, 0)).to.be.revertedWith('Skill does not exist');
        })
        it('should fail to validate a skill if the user try to validate his own skills', async function () {
            const {skillTree, owner, otherAccount} = await deploySkillTree();
            await skillTree.addSkill('javascript', 3);

            async function addSkillValidation() {
                return await skillTree.addSkillValidation(owner.address, 0);
            }

            expect(addSkillValidation()).to.be.revertedWith('You cannot validate your own skills');
        })
        it("should fail to validate a skill if the validator profile does not exist", async function () {
            const {skillTree, owner, user1} = await deploySkillTree();
            await skillTree.addSkill('javascript', 3);

            async function addSkillValidation() {
                return await skillTree.addSkillValidation(user1.address, 0);
            }

            expect(addSkillValidation()).to.be.revertedWith('User does not exist');
        })

    })
});
