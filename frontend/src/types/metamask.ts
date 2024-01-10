import { ethers } from "ethers";
import SkillTreeContract from './contract';

export interface MetamaskContextType {
    account: string | null;
    contract: SkillTreeContract
}