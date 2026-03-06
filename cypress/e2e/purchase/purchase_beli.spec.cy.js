// Generated Cypress spec skeleton for BTW Edutech.
// Assumption: the app exposes stable `data-testid` selectors following the naming
// convention discussed earlier (e.g. auth.login.email, learning.kelas.page, etc).
// Update selectors/assertions if the real app differs.
//
// Required Cypress env variables (set in cypress.env.json or CI):
// - VALID_USER_EMAIL
// - VALID_USER_PASSWORD
//
// Optional env variables depending on your data:
// - INVALID_USER_EMAIL
// - INVALID_USER_PASSWORD
// - TEST_NEW_PASSWORD
// - TEST_PACKAGE_ID
// - TEST_CLASS_ID
// - TEST_MATERI_ID
// - TEST_TRYOUT_ID
// - TEST_PSIKOTES_ID
//
// Note: If you later add support commands (cy.loginByUi / cy.loginByApi / cy.session),
// you can refactor the local helpers in each file into reusable commands.

const tid = (id) => `[data-testid="${id}"]`;

const getEnv = (key) => {
  const value = Cypress.env(key);
  expect(value, `${key} must be provided in Cypress env`).to.be.a('string').and.not.be.empty;
  return value;
};

const loginByUi = () => {
  const email = getEnv('VALID_USER_EMAIL');
  const password = getEnv('VALID_USER_PASSWORD');

  cy.visit('/masuk');
  cy.get(`${tid('auth.login.email')}, input[placeholder="Email"]`).type(email);
  cy.get(`${tid('auth.login.password')}, input[placeholder="Kata Sandi"]`).type(password, { log: false });
  cy.get(`${tid('auth.login.submit')}, button`).contains(/masuk|login/i).click();
  cy.url().should('not.include', '/masuk');
};

describe('Purchase Module', () => {
  beforeEach(() => {
    loginByUi();
    cy.visit('/pembelian');
    cy.get(tid('purchase.list.page')).should('be.visible');
  });

  it('TC-BELI-01/03/05/06/07/09/11/12 - End-to-end pembelian paket', () => {
    const packageId = getEnv('TEST_PACKAGE_ID');

    cy.get(tid(`purchase.list.card.${packageId}`)).should('be.visible');
    cy.get(`${tid(`purchase.list.card.${packageId}.open`)}, ${tid(`purchase.list.card.${packageId}.select`)}`).click();

    cy.get(tid('purchase.detail.page')).should('be.visible');
    cy.get(tid('purchase.detail.title')).should('be.visible');
    cy.get(tid('purchase.detail.buy')).click();

    cy.get(tid('purchase.checkout.page')).should('be.visible');
    cy.get(tid('purchase.checkout.summary')).should('be.visible');

    cy.get('body').then(($body) => {
      if ($body.find(tid('purchase.checkout.paymentMethod')).length) {
        cy.get(tid('purchase.checkout.paymentMethod')).click();
      }
    });

    cy.get(tid('purchase.checkout.pay')).click();

    cy.get('body').then(($body) => {
      if ($body.find(tid('purchase.success.page')).length) {
        cy.get(tid('purchase.success.page')).should('be.visible');
        cy.get(tid('purchase.success.orderId')).should('be.visible');
      } else {
        cy.get(tid('purchase.fail.page')).should('not.exist');
      }
    });
  });
});
