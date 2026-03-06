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

describe('Learning Tryout Module', () => {
  beforeEach(() => {
    loginByUi();
    cy.visit('/belajar-saya/tryout');
    cy.get(tid('learning.tryout.page')).should('be.visible');
  });

  it('TC-TRYOUT-01/02/04/08 - Start, answer, submit, and view result tryout', () => {
    const tryoutId = getEnv('TEST_TRYOUT_ID');

    cy.get(tid(`learning.tryout.card.${tryoutId}`)).should('be.visible');
    cy.get(tid(`learning.tryout.card.${tryoutId}.start`)).click();

    cy.get(tid('learning.tryout.question')).should('be.visible');
    cy.get('[data-testid^="learning.tryout.option."]').first().click();

    cy.get('body').then(($body) => {
      if ($body.find(tid('learning.tryout.next')).length) {
        cy.get(tid('learning.tryout.next')).click();
      }
    });

    cy.get(tid('learning.tryout.submit')).click();

    cy.get(`${tid('learning.tryout.result.page')}, ${tid('common.toast.message')}`)
      .should('be.visible');
  });
});
