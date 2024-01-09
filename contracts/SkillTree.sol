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
        mapping(address => mapping(uint32 => Skill)) private skills;
        mapping(address => SkillValidation) private skillsValidation;

        constructor() {}


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