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

describe('Profile Change Password Module', () => {
  beforeEach(() => {
    loginByUi();
    cy.visit('/profil/ubah-kata-sandi');
    cy.get(tid('profile.password.page')).should('be.visible');
  });

  it('TC-PROFILE-PASS-01 - Ubah kata sandi berhasil', () => {
    const currentPassword = getEnv('VALID_USER_PASSWORD');
    const newPassword = Cypress.env('TEST_NEW_PASSWORD') || 'NewPassword123!';

    cy.get(tid('profile.password.current')).type(currentPassword, { log: false });
    cy.get(tid('profile.password.new')).type(newPassword, { log: false });
    cy.get(tid('profile.password.confirm')).type(newPassword, { log: false });
    cy.get(tid('profile.password.save')).click();

    cy.get(`${tid('profile.password.success')}, ${tid('common.toast.message')}`)
      .should('be.visible');
  });

  it('TC-PROFILE-PASS-02 - Password lama salah', () => {
    cy.get(tid('profile.password.current')).type('WrongPassword123!', { log: false });
    cy.get(tid('profile.password.new')).type('NewPassword123!', { log: false });
    cy.get(tid('profile.password.confirm')).type('NewPassword123!', { log: false });
    cy.get(tid('profile.password.save')).click();

    cy.get(`${tid('profile.password.error')}, ${tid('common.toast.message')}`)
      .should('be.visible');
  });

  it('TC-PROFILE-PASS-03 - Konfirmasi password baru tidak sama', () => {
    cy.get(tid('profile.password.current')).type(getEnv('VALID_USER_PASSWORD'), { log: false });
    cy.get(tid('profile.password.new')).type('NewPassword123!', { log: false });
    cy.get(tid('profile.password.confirm')).type('AnotherPassword123!', { log: false });
    cy.get(tid('profile.password.save')).click();

    cy.get(`${tid('profile.password.validation.confirm')}, ${tid('profile.password.error')}`)
      .should('be.visible');
  });
});
