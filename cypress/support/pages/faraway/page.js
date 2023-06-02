export default {
  collectionName: () => cy.get('[placeholder="Enter collection name"]'),
  collectionSymbol: () => cy.get('[placeholder="Enter collection symbol"]'),
  collectionTokenUri: () => cy.get('[placeholder="Enter collection token URI"]'),
  collectionAddress: () => cy.get('[placeholder="Enter collection address"]'),
  collectionRecipientAddress: () => cy.get('[placeholder="Enter recipient address"]'),
  tokenId: () => cy.get('[placeholder="Enter token id"]'),
  button: () => cy.get('button'),
  firstEvent: () => cy.get('.list-group-item:nth(0)', { timeout: 30000 }),
  secondEvent: () => cy.get('.list-group-item:nth(1)', { timeout: 30000 }),
}