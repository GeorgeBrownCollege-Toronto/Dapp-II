FROM ethereum/solc:0.8.0 as build-deps

FROM node:14
COPY --from=build-deps /usr/bin/solc /usr/bin/solc