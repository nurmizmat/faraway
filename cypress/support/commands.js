// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('setupMetamask', (secretWords, password) => {
  return cy.task('setupMetamask', { secretWords, password }, { log: false });
});

Cypress.Commands.add('addNetwork', network  => {
  return cy.task('addNetwork', network, { timeout: 120000 }, { log: false });
});

Cypress.Commands.add('confirmTransaction', () => {
  return cy.task('confirmTransaction', { log: false });
});

Cypress.Commands.add('connectMetamask', () => {
  return cy.task('connectMetamask', { log: false });
});

Cypress.Commands.add('sendMessage', (text) => {
  cy.request({
    method: 'POST',
    url: `https://api.telegram.org/bot${Cypress.env('botID')}/sendMessage`,
    body: {
      chat_id: Cypress.env('chatID'),
      disable_notification: false,
      disable_web_page_preview: false,
      reply_to_message_id: null,
      text,
    },
  });
});


