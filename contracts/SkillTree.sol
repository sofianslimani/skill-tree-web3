// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


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

    mapping(address => Profile) private profiles;
    mapping(address => Skill[]) private skills;
    mapping(address => SkillValidation) private skillsValidation;

    constructor() {}


//
//    function listUsers() public view returns (Profile[] memory) {
//        //TODO : fill this
//    }
//
    function getUserSkills(address _address) public view returns (Skill[] memory) {
        return skills[_address];
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
//    function addSkill(string memory _name, uint memory _level) public {
//        //TODO: fill this
//    }
//
//    function editSkill(uint32 _skillId, Skill _newSkill) public  {
//        //TODO: fill this
//    }
//
//    function deleteSkill(uint32 _skillId) public  {
//        //TODO: fill this
//    }
//
//    function addSkillValidation(address _userAddress, uint32 _skillId) public  {
//        //TODO: fill this
//    }
}