import { useState, useEffect, useRef, Suspense } from "react";
import { Button, Box } from "@chakra-ui/core";
import {
  ListItem,
  UnorderedList,
  InputGroup,
  InputLeftAddon,
  Input,
  InputRightAddon,
  Stack,
} from "@chakra-ui/react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import MetaMaskOnboarding from "@metamask/onboarding";
import { useQueryParameters } from "../hooks/useQueryParamters";
import { useSurveyFactoryOwner } from "../hooks/useSurveyFactoryOwner";
import { useSurveyCreationFees } from "../hooks/useSurveyCreationFees";
import { useCreateSurvey } from "../hooks/useCreateSurvey";
import {
  useSurveys,
  useSurveyOwners,
  useSurveyRewards,
} from "../hooks/useSurveys";
import { QueryParameters } from "../constants";
import { getNetwork, injected } from "../connectors";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { useETHBalance } from "../hooks/useETHBalance";
import { TokenAmount } from "@uniswap/sdk";
import { formatUnits, parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import {
  useQuery,
  gql,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.thegraph.com/subgraphs/name/dhruvinparikh/survey-marketplace-subgraph",
});

const GET_SURVEYS = gql`
  query GetSurveys {
    surveyCreateds {
      id
      owner
      surveyId
      surveyAddress
    }
  }
`;

interface Survey {
  id: string;
  owner: string;
  surveyAddress: string;
  surveyId: string;
}

interface SurveyData {
  surveyCreateds: Survey[];
}

function ETHBalance(): JSX.Element {
  const { account } = useWeb3React();
  const { data } = useETHBalance(account, true);

  return (
    <div>
      <p>Account address : {account}</p>
      <p>
        Balance :{" "}
        {(data as TokenAmount).toSignificant(4, { groupSeparator: "," })} ETH
      </p>
    </div>
  );
}

function Survey(): JSX.Element {
  const [reward, setReward] = useState("0.001");
  const { data: surveyFactoryOwner } = useSurveyFactoryOwner(true);
  const { data: surveyCreationFee } = useSurveyCreationFees(true);
  const createSurvey = useCreateSurvey(
    BigNumber.from(surveyCreationFee).add(parseUnits(reward)),
    true
  );
  const { data: surveys } = useSurveys(true);
  const surveyOwners = useSurveyOwners(surveys, false);
  const surveyRewards = useSurveyRewards(surveys, false);

  const { loading, data } = useQuery<SurveyData>(GET_SURVEYS, {
    client,
    pollInterval: 0,
    ssr: false,
  });

  const handleCreateSurvey = async () => {
    await createSurvey();
  };

  return (
    <>
      <p>Survey Factory Owner : {surveyFactoryOwner}</p>
      <p>Survey Creation Fee : {formatUnits(surveyCreationFee)} ETH</p>
      <Stack spacing={4}>
        <InputGroup>
          <InputLeftAddon children="Survey Reward" />
          <Input
            type="text"
            placeholder="Reward"
            value={reward}
            onChange={(event) => {
              setReward(event.target.value);
            }}
          />
          <InputRightAddon children="ETH" />
        </InputGroup>
      </Stack>
      <Button onClick={handleCreateSurvey}>Create Survey</Button>
      <p>Result from The Graph protocol</p>
      {loading ? (
        <p>Loading ...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Owner</th>
              <th>SurveyId</th>
              <th>SurveyAddress</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.surveyCreateds.map((survey) => (
                <tr key={survey.id}>
                  <td>{survey.owner}</td>
                  <td>{survey.surveyAddress}</td>
                  <td>{survey.surveyId}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <p>List Of Surveys</p>
      <UnorderedList>
        {surveys.map((survey: string, index: number) => (
          <ListItem key={index}>{survey}</ListItem>
        ))}
      </UnorderedList>
      <p>Survey Owner</p>
      <UnorderedList>
        {surveyOwners.map((surveyOwner: string, index: number) => (
          <ListItem key={index}>{surveyOwner}</ListItem>
        ))}
      </UnorderedList>
      <p>Survey Rewards</p>
      <UnorderedList>
        {surveyRewards.map((surveyReward: string, index: number) => (
          <ListItem key={index}>{`${surveyReward} ETH`}</ListItem>
        ))}
      </UnorderedList>
    </>
  );
}

export default function Account({
  triedToEagerConnect,
}: {
  triedToEagerConnect: boolean;
}): JSX.Element | null {
  const { active, error, activate, library, chainId, account, setError } =
    useWeb3React<Web3Provider>();

  // initialize metamask onboarding
  const onboarding = useRef<MetaMaskOnboarding>();

  // useLayoutEffect(() => {
  //     onboarding.current = new MetaMaskOnboarding();
  // }, [])

  // automatically try connecting network connector where applicable
  const queryParameters = useQueryParameters();
  const requiredChainID = queryParameters[QueryParameters.CHAIN];

  useEffect(() => {
    if (triedToEagerConnect && !active && !error) {
      activate(getNetwork(requiredChainID));
    }
  }, [triedToEagerConnect, active, error, requiredChainID, activate]);

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (active || error) {
      setConnecting(false);
      onboarding.current?.stopOnboarding();
    }
  }, [active, error]);

  if (error) {
    return null;
  } else if (!triedToEagerConnect) {
    return null;
  } else if (typeof account !== "string") {
    return (
      <Box>
        {MetaMaskOnboarding.isMetaMaskInstalled() ||
        (window as any)?.ethereum ||
        (window as any)?.web3 ? (
          <Button
            isLoading={connecting}
            leftIcon={
              MetaMaskOnboarding.isMetaMaskInstalled()
                ? ("metamask" as "edit")
                : undefined
            }
            onClick={(): void => {
              setConnecting(true);
              activate(injected, undefined, true).catch((error) => {
                if (error instanceof UserRejectedRequestError) {
                  setConnecting(false);
                } else {
                  setError(error);
                }
              });
            }}
          >
            {MetaMaskOnboarding.isMetaMaskInstalled()
              ? "Connect to MetaMask"
              : "Connect to Wallet"}
          </Button>
        ) : (
          <Button
            leftIcon={"metamask" as "edit"}
            onClick={() => onboarding.current?.startOnboarding()}
          >
            Install Metamask
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Suspense
      fallback={
        <Button
          variant="outline"
          isLoading
          cursor="default !important"
          _hover={{}}
          _active={{}}
          style={{
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: "none",
          }}
        >
          {null}
        </Button>
      }
    >
      <ETHBalance />
      <Survey />
    </Suspense>
  );
}
