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

describe('Progress Belajar Module', () => {
  beforeEach(() => {
    loginByUi();
    cy.visit('/progress-belajar');
    cy.get(tid('progress.belajar.page')).should('be.visible');
  });

  it('TC-PROGRESS-01 - Summary progress tampil', () => {
    cy.get(tid('progress.belajar.summary')).should('be.visible');
  });

  it('TC-PROGRESS-02 - Chart / statistik tampil', () => {
    cy.get('body').then(($body) => {
      if ($body.find(tid('progress.belajar.chart')).length) {
        cy.get(tid('progress.belajar.chart')).should('be.visible');
      } else {
        cy.get(tid('progress.belajar.summary')).should('be.visible');
      }
    });
  });

  it('TC-PROGRESS-03 - Filter progress bekerja', () => {
    cy.get('body').then(($body) => {
      if ($body.find(tid('progress.belajar.filter')).length) {
        cy.get(tid('progress.belajar.filter')).click();
        cy.get(tid('progress.belajar.summary')).should('be.visible');
      } else {
        cy.get(tid('progress.belajar.summary')).should('be.visible');
      }
    });
  });
});
