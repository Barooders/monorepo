import { SEARCH_DOMAIN, TrackedElements } from '@/config/e2e';

// This should be in support/e2e.ts but a current bug prevents it from working there.
// See: https://github.com/cypress-io/cypress/issues/22929#issuecomment-1839513931
Cypress.on('uncaught:exception', () => {
  return false;
});

const collectionPage = {
  handle: '/collections/vtt',
  title: `VTT d'occasion`,
};
const HITS_COUNT_REGEX = /\(\s*([1-9]\d*)\s*\)/;

describe('test catalog pages', () => {
  beforeEach(() => {
    cy.visit(collectionPage.handle);
  });

  it(`collection page title is: ${collectionPage.title}`, () => {
    cy.get('h1').contains(`${collectionPage.title}`);
  });

  it('collection has more than 0 result', () => {
    cy.get(`span[data-id*="${TrackedElements.HITS_COUNT}"]`).contains(
      HITS_COUNT_REGEX,
    );
  });

  it('can filter results by product condition', () => {
    let countBeforeFilter: number;

    cy.intercept('POST', `https://${SEARCH_DOMAIN}/multi_search*`).as(
      'fetchResults',
    );

    cy.get(`span[data-id*="${TrackedElements.HITS_COUNT}"]`).then((el) => {
      countBeforeFilter = parseInt(RegExp(HITS_COUNT_REGEX).exec(el.text())[1]);
    });
    cy.get('input:not(#modal-root input)[id="AS_NEW"]').click({ force: true });

    cy.wait('@fetchResults');

    cy.url().should('include', '=AS_NEW');

    cy.get(`span[data-id*="${TrackedElements.HITS_COUNT}"]`).then((el) => {
      const countAfterFilter = parseInt(
        RegExp(HITS_COUNT_REGEX).exec(el.text())[1],
      );
      expect(countBeforeFilter).to.greaterThan(countAfterFilter);
    });
  });

  it('can open first product page', () => {
    cy.get(`a[href*="/products/"]`).first().click({ force: true });
    cy.url().should('include', '/products/');
  });

  it('can open proceed to checkout from product page', () => {
    cy.get(`a[href*="/products/"]`).first().click({ force: true });
    cy.get('button').contains('Acheter').first().click({ force: true });
    cy.url().should('include', '/checkouts/');
  });
});
