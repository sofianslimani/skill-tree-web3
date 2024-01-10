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

    function getUserSkills(address _address) public view returns (SkillDto[] memory) {
        SkillDto[] memory userSkills = new SkillDto[](skills[_address].length);
        for (uint i = 0; i < skills[_address].length; i++) {
            Skill memory skill = skills[_address][i];
            userSkills[i] = SkillDto({
                name: skill.name,
                level: skill.level,
                validations: filterSkillValidation(_address, uint32(i))
            });
        }
        return userSkills;
    }

    function getUserSkillValidations(address _address) public view returns (SkillValidation[] memory) {
        return skillsValidation[_address];
    }

    function filterSkillValidation(address _address, uint32 _skillId) private view returns (SkillValidation[] memory) {
        SkillValidation[] memory userSkillsValidation = skillsValidation[_address];
        uint resultCount = 0;
        for (uint j = 0; j < userSkillsValidation.length; j++) {
            SkillValidation memory skillValidation = userSkillsValidation[j];
            if (skillValidation.skillId == _skillId) {
                resultCount++;
            }
        }
        SkillValidation[] memory skillValidations = new SkillValidation[](resultCount);
        uint resultIndex = 0;
        for (uint j = 0; j < userSkillsValidation.length; j++) {
            SkillValidation memory skillValidation = userSkillsValidation[j];
            if (skillValidation.skillId == _skillId) {
                skillValidations[resultIndex] = skillValidation;
                resultIndex++;
            }
        }
        return skillValidations;
    }

    address[] private userAddresses;

    function addUser(address _userAddress, string memory _firstName, string memory _lastName) public {
        // Ajouter le profil
        profiles[_userAddress] = Profile(_lastName, _firstName);

        // Ajouter l'adresse à la liste des adresses
        userAddresses.push(_userAddress);
    }

    function listUsers() public view returns (address[] memory) {
        uint count = 0;

        // Count how many users are not the caller
        for (uint i = 0; i < userAddresses.length; i++) {
            if (userAddresses[i] != msg.sender) {
                count++;
            }
        }

        address[] memory nonCallerUsers = new address[](count);
        uint j = 0;

        // Populate the array with users that are not the caller
        for (uint i = 0; i < userAddresses.length; i++) {
            if (userAddresses[i] != msg.sender) {
                nonCallerUsers[j] = userAddresses[i];
                j++;
            }
        }

        return nonCallerUsers;
    }

    //
//    function getUserSkills(address _address) public view returns (Skill[] memory) {
//        //TODO : fill this
//    }
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
    function deleteSkill(uint32 _skillId) public  {
        require(_skillId < skills[msg.sender].length, "Skill does not exist");

        // Shift elements to the left
        for (uint i = _skillId; i < skills[msg.sender].length - 1; i++) {
            skills[msg.sender][i] = skills[msg.sender][i + 1];
        }

        // Delete the last element
        skills[msg.sender].pop();

        // Do the same for skillsValidation
        for (uint i = 0; i < skillsValidation[msg.sender].length; i++) {
            if (skillsValidation[msg.sender][i].skillId == _skillId) {
                for (uint j = i; j < skillsValidation[msg.sender].length - 1; j++) {
                    skillsValidation[msg.sender][j] = skillsValidation[msg.sender][j + 1];
                }
                skillsValidation[msg.sender].pop();
                i--; // Decrement i as the array length has decreased
            }
        }
    }

    function filterSkills(uint32 _skillId) private view returns(Skill[] memory) {
        uint resultCount = 0;
        for (uint i = 0; i < skills[msg.sender].length; i++) {
            Skill memory skill = skills[msg.sender][i];
            if (i != _skillId) {
                resultCount++;
            }
        }
        Skill[] memory result = new Skill[](resultCount);
        uint resultIndex = 0;
        for (uint i = 0; i < skills[msg.sender].length; i++) {
            Skill memory skill = skills[msg.sender][i];
            if (i != _skillId) {
                result[resultIndex] = skill;
                resultIndex++;
            }
        }
        return result;
    }

    function addSkillValidation(address _userAddress, uint32 _skillId) public {
        require(msg.sender != _userAddress, "You cannot validate your own skills");
        require(_skillId < skills[_userAddress].length, "Skill does not exist");
        skillsValidation[_userAddress].push(SkillValidation({
            validator: msg.sender,
            skillId: _skillId
        }));
    }

}