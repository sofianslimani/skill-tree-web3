// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract SkillTree {
    struct Skill {
        string name;
        uint level;
    }

    struct Profile {
        string lastName;
        string firstName;
        //address walletAddress;
    }

    struct SkillValidation {
        address validator;
        uint32 skillId;
    }

    struct SkillDto {
        string name;
        uint level;
        SkillValidation[] validations;
    }

    mapping(address => Profile) private profiles;
    mapping(address => Skill[]) private skills;
    mapping(address => SkillValidation[]) private skillsValidation;

    constructor() {}

//
//    function listUsers() public view returns (Profile[] memory) {
//        //TODO : fill this
//    }
//
    function getUserSkills(address _address) public view returns (SkillDto[] memory) {
        SkillValidation[] memory userSkillsValidation = skillsValidation[_address];
        SkillDto[] memory userSkills = new SkillDto[](skills[_address].length);
        for (uint i = 0; i < skills[_address].length; i++) {
            Skill memory skill = skills[_address][i];
            uint  resultCount = 0;
            for (uint j = 0; j < userSkillsValidation.length; j++) {
                SkillValidation memory skillValidation = userSkillsValidation[j];
                if (skillValidation.skillId == i) {
                    resultCount++;
                }
            }
            SkillValidation[] memory skillValidations = new SkillValidation[](resultCount);
            uint resultIndex = 0;
            for (uint j = 0; j < userSkillsValidation.length; j++) {
                SkillValidation memory skillValidation = userSkillsValidation[j];
                if (skillValidation.skillId == i) {
                    skillValidations[resultIndex] = skillValidation;
                    resultIndex++;
                }
            }
            userSkills[i] = SkillDto({
                name: skill.name,
                level: skill.level,
                validations: skillValidations
            });
        }
        return userSkills;
    }
//
//    function getUser(address _address) public view returns (Profile memory) {
//        // TODO: fill this
//    }
//
//    function editProfile(string memory _lastName, string memory _firstName) public {
//        //TODO: fill this
//    }
//
    function addSkill(string memory _name, uint _level) public {
        require(_level >= 1 && _level <= 5, "Skill level must be between 1 and 5");
        skills[msg.sender].push(Skill({
            name: _name,
            level: _level
        }));
    }
//
//    function editSkill(uint32 _skillId, Skill _newSkill) public  {
//        //TODO: fill this
//    }
//
//    function deleteSkill(uint32 _skillId) public  {
//        //TODO: fill this
//    }
//
    function addSkillValidation(address _userAddress, uint32 _skillId) public {
        require(msg.sender != _userAddress, "You cannot validate your own skills");
        require(_skillId < skills[_userAddress].length, "Skill does not exist");
        skillsValidation[_userAddress].push(SkillValidation({
            validator: msg.sender,
            skillId: _skillId
        }));
    }

}