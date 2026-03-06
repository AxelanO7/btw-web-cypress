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
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";
  const captcha =
    "0.dJ5o3df9UZw2YWwt0Q-Lq6Yk9pCTw8gSrSJC6L3wfMTDXwfLQ5iZ3YTxjMsEkVymilTtM0Z-FYd2DjI7aDmrxXKcGg_dynGiTPhnBofhBv6UPUDCxALsHJE_tJX49vjGsIWP8hHGNJtUUvBZSpLMF2LpfaKB23HRxC9uI1S4Knt6WPghMfHk0607juFC5yCMmpWqZYrmMV9wK9VytAu3SuzgNMpNx8ea2MRJWjtL0gDCdy4Ar7dQI5R7SLCHjSyz6kEp3-HHP9P91ZOyEMvIImId_TsVaUyn12WQY3evux0bgFb3Jqds73HqzJWUDHkBAIQHBGwLHEz1KLUML38-8bU3dctn6Q-sFHNQTW2CL9niEwekVF7YJNMEcSBDeOUhitNvlpfffiZfzwxwSLKApiioD-I_J3yBlaop-1svEJjJJoE1d6yD7iXIXpu1n498Xpn3CuS8gEvGST0nCn5bv0-ATHEd7LjcyWQaD0Np59-qA0IiwcZBM424z2qScAhhdHX6qPO8bpHrOpNu_3v2IiUX58jfigc2fjrWE0srz9i7gkO86lqvhViGZz0LgVKwKKrliQABWzXtXUwqt6D9QKuvNDK6Sfu3tQiPhQa-r7cT-sMxIoFB_R9Q7ed6M6d0EVBX229oN1TeHuBz6XaswK7u2g8LfVL7BhuGXKyunq00YA4ABPYewPofeVWIZjJcq06Lo2Q2mD5-9uTmqEmLmYDaPiW55w3nOMRXQnXeokA7K8oBq6z2-T9nKkf7sjrMovTRIICmkYKkkKaTa9t7HbkGJ-iiGl2EfP8L58wV95zdMA1__8VA5PvG3ROHMdhzSBoLFHTU0UOpHMa6IpIiZ9VGIUvYkHBeOh9AG407NnLuntWTp2z9XFLQG9wFdYd_EYZG7DLMuDh4cUhaYxCo8CJVvurt2y36y6J6wcZPQyENJRJRtxtfJzPm38g3iQixV-yz3Et_NbNZ6KfeWZnCLNy25m5OA3-pI0dMd3SmGBc.czEPL5cebSKci9a7zEIv0w.cf409726a04df1fbd6ec7af32e6116a7379223185eac1e5fcbdd0ffebb90c8a4";

  cy.login(email, password, captcha);
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
