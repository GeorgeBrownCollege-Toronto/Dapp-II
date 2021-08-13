import { useWeb3React } from '@web3-react/core';
import useSWR, { SWRResponse } from 'swr';
import { Contract } from "@ethersproject/contracts"
import { BigNumber, BigNumberish } from "@ethersproject/bignumber"
import { useContract } from './useContract';
import SurveyFactory from "../contracts/SurveyFactory.json"
import TrustedSurvey from "../contracts/TrustedSurvey.json"
import { useKeepSWRDATALiveAsBlocksArrive } from './useKeepSWRDATALiveAsBlocksArrive';
import { Web3Provider } from '@ethersproject/providers';
import { Token, TokenAmount } from '@uniswap/sdk';
import { ADDRESS_ZERO } from '../constants';
import { DataType } from '../utils';

function getSurveys(contract: Contract): (address: any) => Promise<any> {
    return async (): Promise<any> => {
        return contract.getAllSurveys().then((result: any) => result)
    }
}

function getSurveyOwner(contract: Contract): (address: any) => Promise<any> {
    return async (): Promise<any> => {
        return contract.owner().then((result: any) => result)
    }
}

function getSurveyReward(library: Web3Provider, survey: string): (chainId: number) => Promise<TokenAmount> {
    return async (chainId: number): Promise<TokenAmount> => {
        const ETH = new Token(chainId, ADDRESS_ZERO, 18)
        return library.getBalance(survey)
            .then((balance: { toString: () => string }) => new TokenAmount(ETH, balance.toString()))
    }
}

export function useSurveys(suspense = false): SWRResponse<any, any> {
    const { chainId } = useWeb3React();

    const contract = useContract(SurveyFactory?.address, SurveyFactory?.abi, true);

    const result = useSWR(SurveyFactory && contract ? [chainId, SurveyFactory.address] : null,
        getSurveys(contract as Contract), {
        suspense
    });

    useKeepSWRDATALiveAsBlocksArrive(result.mutate)

    return result;
}

export function useSurveyOwners(surveys: string[], suspense = false): SWRResponse<any, any> {
    const { chainId } = useWeb3React();

    let result: any = [];
    for (const survey of surveys) {
        const contract = useContract(survey, TrustedSurvey?.abi, true);
        const owner = useSWR(TrustedSurvey && contract ? [chainId, survey] : null,
            getSurveyOwner(contract as Contract), {
            suspense
        });
        result.push(owner.data)
    }

    // useKeepSWRDATALiveAsBlocksArrive(result.mutate)
    return result;
}

export function useSurveyRewards(surveys: string[], suspense = false): SWRResponse<any, any> {
    const { chainId, library } = useWeb3React();

    let result: any = [];
    for (const survey of surveys) {
        const shouldFetch = typeof chainId === 'number' && typeof survey === 'string' && !!library


        const reward = useSWR(shouldFetch ? [chainId, survey, DataType.ETHBalance] : null, getSurveyReward(library, survey), {
            suspense
        });
        const rewardBalance: TokenAmount = reward.data as TokenAmount
        const finalBalance: string = rewardBalance && rewardBalance.toSignificant(4, { groupSeparator: ',' })
        result.push(finalBalance)
    }

    // useKeepSWRDATALiveAsBlocksArrive(result.mutate)
    return result;
}