# survey-marketplace-hardhat

Decentralized survey marketplace

## Setup

The repository uses Docker Compose to manage sensitive keys and load the configuration. Prior any action like test or deploy, you must run `docker compose up` to start the `contracts-env` container, and then connect to the container console via `docker compose exec contracts-env bash`.

Follow the next steps to setup the repository:

- Install `docker` and `docker compose`
- Create an environment file named `.env` and fill the next environment variables

```
# Mnemonic, only first address will be used
MNEMONIC=""

# Add Infura provider keys
INFURA_KEY=""


# Optional Etherscan key, for automatize the verification of the contracts at Etherscan
ETHERSCAN_KEY=""
```

## Test

You can run the full test suite with the following commands:

```
# In one terminal
docker compose up

# Open another tab or terminal
docker compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run test
```

## Deployments

For deploying Survey marketplace SurveyFactory contract, you can use the available scripts located at `package.json`. For a complete list, run `npm run` to see all the tasks.

### Rinkeby deployment

```
# In one terminal
docker compose up

# Open another tab or terminal
docker compose exec contracts-env bash

# A new Bash terminal is prompted, connected to the container
npm run survey:rinkeby:full:migration -- --surveycreationfees <fees-in-ETH> --verify <false|true>
```
