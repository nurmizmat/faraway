import { faker } from '@faker-js/faker';
import page from '../support/pages/faraway/page';

describe('Faraway - create collection and NFT', () => {
  it('Import Metamask wallet', () => {
    cy.setupMetamask(
      Cypress.env('walletSecret'),
      Cypress.env('walletPassword'),
    ).then(setupFinished => {
      expect(setupFinished).to.be.true;
    });
  });

  it('Add testnet Mumbai', () => {
    cy.addNetwork({
      networkName: 'Mumbai',
      rpcUrl: 'https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78',
      chainId: '80001',
      symbol: 'MATIC',
      blockExplorer: 'https://mumbai.polygonscan.com',
      isTestnet: true,
    }).then(networkAdded => {
      expect(networkAdded).to.be.true;
    });
  });

  it('Run docker images', () => {
    cy.exec('docker-compose -f docker-compose.yml up -d', { timeout: 60000 });
  });
  
  it('Create collection, NFT and send message to Telegram', () => {
    const collectionName = faker.commerce.productName();
    const collectionSymbol = faker.string.alphanumeric(5);
    const tokenId = faker.string.numeric(5);

    cy.wait(10000);
    cy.visit(Cypress.env('baseUrl'));

    cy.connectMetamask().then(connected => {
      expect(connected).to.be.true;
    });

    page.collectionName().type(collectionName);
    page.collectionSymbol().type(collectionSymbol);
    page.collectionTokenUri().type(Cypress.env('baseUrl'));
    page.button().contains('Create').click();

    cy.confirmTransaction().then(confirmed => {
      expect(confirmed).to.be.true;
    });

    page.firstEvent().invoke('text').then((text) => {
      const regex = /address: (0x[a-zA-Z0-9]+)/;
      const match = text.match(regex);
      const collectionAddress = match ? match[1] : null;
      expect(collectionAddress)
        .to.have.lengthOf(42);
      expect(text)
        .to.contain(`Collection Created with address: ${collectionAddress}`)
        .and.to.contain(`name: ${collectionName}`)
        .and.to.contain(`symbol: ${collectionSymbol}`);

      cy.sendMessage(text);

      page.collectionAddress().type(collectionAddress);
      page.collectionRecipientAddress().type(Cypress.env('walletAddress'));
      page.tokenId().type(tokenId);
      page.button().contains('Mint').click();
  
      cy.confirmTransaction().then(confirmed => {
        expect(confirmed).to.be.true;
      });
  
      page.secondEvent().invoke('text').then((text) => {
        expect(text)
          .to.contain(`NFT minted for collection: ${collectionAddress}`)
          .and.to.contain(`to: ${Cypress.env('walletAddress')}`)
          .and.to.contain(`token id: ${tokenId}`)
          .and.to.contain(`token URI: ${Cypress.env('baseUrl')}${tokenId}`)

        cy.sendMessage(text);
      });
    });
  });

  it('Down docker images', () => {
    cy.exec('docker-compose down');
  });
});


