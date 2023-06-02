# NFT Collection Deployer

This project includes a smart contract deployed on the Polygon Mumbai EVM-chain for creating NFT collections and NFTs within those collections. It also consists of a backend application, as well as a client application for interacting with the smart contract and tracking events.

## Smart Contract

Polygon Mumbai EVM-chain address: 0x54EEDe47850fE932f5466B6fa708bf1176371966

## Backend Application

The backend application, deployed as the `evercoinx/faraway:nft-collection-deployer-backend` Docker image, tracks events related to the smart contract on the blockchain. It stores these events in memory and provides access to them through an API. Only events occurring after the backend application has been launched are available.

## Client Application

The client application, deployed as the `evercoinx/faraway:nft-collection-deployer-frontend` Docker image, interacts with the smart contract and the backend application. It enables users to create NFT collections and NFTs by sending transactions to the smart contract. The client application also receives and displays events from the backend application.

## Test Cases

### Collection Creation

If the form is correctly filled out and a transaction is sent to create a collection, the expected result is the display of a new event containing the form data in the client application's interface. The address of the created collection should also be visible in the interface.

### NFT Creation

If the form data is correctly filled out, the expected result is the successful creation of an NFT within the selected collection. The client application's interface should display an event confirming the creation of the NFT.

## Results

The results of the actions performed in the application are sent to the Telegram channel available at [Faraway Events](https://t.me/faraway_events).

Telegram screenshot:

![Alt Text](https://github.com/nurmizmat/faraway/raw/main/cypress/downloads/faraway-telegram.jpg)

Video:

[![Alt Text](https://github.com/nurmizmat/faraway/raw/main/cypress/downloads/faraway-test.png)](https://github.com/nurmizmat/faraway/raw/main/cypress/downloads/faraway-test.mp4)


