// This should be in support/e2e.ts but a current bug prevents it from working there.
// See: https://github.com/cypress-io/cypress/issues/22929#issuecomment-1839513931
Cypress.on('uncaught:exception', () => {
  return false;
});

describe('test homepage', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('homepage is loaded', () => {
    cy.get('#barooders-main-header').should('exist');
  });

  it('click on my account page from menu', () => {
    cy.get('header a[href*="/account"]').first().click({ force: true });
    cy.url().should('include', '/account/login?return_url=%2Faccount');
  });
});
