import { Contract, BaseContractMethod } from "ethers";

interface SkillValidationDto {
  validatorAddress: string;
  validator: {
    lastName: string;
    firstName: string;
  };
  skillId: number;
}

interface SkillDto {
    name: string;
    level: number;
    validations: SkillValidationDto[];
}

interface SkillTreeContract extends Contract {
    addSkill: BaseContractMethod<any, void, void>;
    addSkillValidation: BaseContractMethod<any, void, void>;
    addUser: BaseContractMethod<any, void, void>;
    deleteSkill: BaseContractMethod<any, void, void>;
    editSkill: BaseContractMethod<any, void, void>;
    getUserSkillValidations: BaseContractMethod<any[], SkillValidationDto[]>;
    getUserSkills: BaseContractMethod<any, SkillDto[]>;
    listUsers: BaseContractMethod<any, string[]>;
}

export default SkillTreeContract;
