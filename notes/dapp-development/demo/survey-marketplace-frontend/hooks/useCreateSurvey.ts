import { Contract } from "@ethersproject/contracts"
import { useContract } from './useContract';
import SurveyFactory from "../contracts/SurveyFactory.json"
// import { TokenAmount } from '@uniswap/sdk'
import { BigNumberish } from "@ethersproject/bignumber"

export function useCreateSurvey(fee: BigNumberish, suspense = false): any {
    const contract = useContract(SurveyFactory?.address, SurveyFactory?.abi, true);

    return async () => {
        return (contract as Contract).createSurvey({ value: fee, gasLimit: "3000000" });
    }
}
