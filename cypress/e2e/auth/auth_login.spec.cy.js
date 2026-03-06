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

describe('Auth Login Module', () => {
  beforeEach(() => {
    cy.visit('/masuk');
  });

  it('TC-LOGIN-02 - Email kosong', () => {
    cy.get(`${tid('auth.login.password')}, input[placeholder="Kata Sandi"]`).type('invalidPassword', { log: false });
    cy.get(`${tid('auth.login.submit')}, button`).contains(/masuk|login/i).click();

    cy.get(`${tid('auth.login.validation.email')}, .error, .input-error`)
      .should('be.visible')
      .and('contain.text', 'Email');

    cy.url().should('include', '/masuk');
  });

  it('TC-LOGIN-03 - Password kosong', () => {
    cy.get(`${tid('auth.login.email')}, input[placeholder="Email"]`).type('user@example.com');
    cy.get(`${tid('auth.login.submit')}, button`).contains(/masuk|login/i).click();

    cy.get(`${tid('auth.login.validation.password')}, .error, .input-error`)
      .should('be.visible')
      .and('contain.text', 'Kata Sandi');

    cy.url().should('include', '/masuk');
  });

  it('TC-LOGIN-05 - Password salah', () => {
    const invalidEmail = Cypress.env('INVALID_USER_EMAIL') || getEnv('VALID_USER_EMAIL');
    const invalidPassword = Cypress.env('INVALID_USER_PASSWORD') || 'WrongPassword123!';

    cy.get(`${tid('auth.login.email')}, input[placeholder="Email"]`).type(invalidEmail);
    cy.get(`${tid('auth.login.password')}, input[placeholder="Kata Sandi"]`).type(invalidPassword, { log: false });
    cy.get(`${tid('auth.login.submit')}, button`).contains(/masuk|login/i).click();

    cy.get(`${tid('auth.login.error')}, .toast, .alert`)
      .should('be.visible')
      .and('contain.text', 'salah');

    cy.url().should('include', '/masuk');
  });

  it('TC-LOGIN-01 - Login berhasil', () => {
    const email = getEnv('VALID_USER_EMAIL');
    const password = getEnv('VALID_USER_PASSWORD');

    cy.get(`${tid('auth.login.email')}, input[placeholder="Email"]`).type(email);
    cy.get(`${tid('auth.login.password')}, input[placeholder="Kata Sandi"]`).type(password, { log: false });
    cy.get(`${tid('auth.login.submit')}, button`).contains(/masuk|login/i).click();

    cy.url().should('not.include', '/masuk');
    cy.get(`${tid('dashboard.page')}, .sidebar, nav`).should('be.visible');
  });
});
