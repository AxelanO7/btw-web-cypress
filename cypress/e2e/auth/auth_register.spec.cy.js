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

describe('Auth Register Module', () => {
  beforeEach(() => {
    cy.visit('/daftar');
  });

  it('TC-REG-01 - Register berhasil', () => {
    const unique = Date.now();
    cy.get(tid('auth.register.fullname')).type(`Automation User ${unique}`);
    cy.get(tid('auth.register.email')).type(`automation.${unique}@mail.test`);
    cy.get(tid('auth.register.phone')).type('081234567890');
    cy.get(tid('auth.register.password')).type('Password123!', { log: false });
    cy.get(tid('auth.register.confirmPassword')).type('Password123!', { log: false });
    cy.get(tid('auth.register.submit')).click();

    cy.get(`${tid('auth.register.success')}, ${tid('common.toast.message')}`)
      .should('be.visible');
  });

  it('TC-REG-02 - Field wajib kosong tervalidasi', () => {
    cy.get(tid('auth.register.submit')).click();

    cy.get(tid('auth.register.validation.fullname')).should('be.visible');
    cy.get(tid('auth.register.validation.email')).should('be.visible');
    cy.get(tid('auth.register.validation.password')).should('be.visible');
  });

  it('TC-REG-03 - Email tidak valid', () => {
    cy.get(tid('auth.register.fullname')).type('Automation User');
    cy.get(tid('auth.register.email')).type('invalid-email');
    cy.get(tid('auth.register.password')).type('Password123!', { log: false });
    cy.get(tid('auth.register.confirmPassword')).type('Password123!', { log: false });
    cy.get(tid('auth.register.submit')).click();

    cy.get(tid('auth.register.validation.email'))
      .should('be.visible');
  });

  it('TC-REG-05 - Konfirmasi password tidak sama', () => {
    cy.get(tid('auth.register.fullname')).type('Automation User');
    cy.get(tid('auth.register.email')).type(`automation.${Date.now()}@mail.test`);
    cy.get(tid('auth.register.password')).type('Password123!', { log: false });
    cy.get(tid('auth.register.confirmPassword')).type('Different123!', { log: false });
    cy.get(tid('auth.register.submit')).click();

    cy.get(`${tid('auth.register.validation.confirmPassword')}, ${tid('auth.register.error')}`)
      .should('be.visible');
  });

  it('TC-REG-07 - Register dengan data duplikat ditolak', () => {
    const email = getEnv('VALID_USER_EMAIL');

    cy.get(tid('auth.register.fullname')).type('Existing User');
    cy.get(tid('auth.register.email')).type(email);
    cy.get(tid('auth.register.phone')).type('081234567890');
    cy.get(tid('auth.register.password')).type('Password123!', { log: false });
    cy.get(tid('auth.register.confirmPassword')).type('Password123!', { log: false });
    cy.get(tid('auth.register.submit')).click();

    cy.get(tid('auth.register.error')).should('be.visible');
  });
});
