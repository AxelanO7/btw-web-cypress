// Cypress end-to-end tests for the BTW Edutech login flow.
//
// This spec covers the high-priority automated test cases for the login
// module. The tests are organised so that form validation errors are
// exercised first, followed by an authentication failure and then a
// successful login. Adjust selectors or assertions if the
// application’s markup or messaging differs. It is assumed that
// `data-testid` attributes will be available on key elements; if they
// are not yet present, the tests fall back to using placeholders or
// visible text.

describe("Auth Login Module", () => {
  /**
   * Before every test we navigate directly to the login page. Cypress
   * automatically preserves cookies and localStorage between tests
   * unless configured otherwise, but visiting the page ensures each
   * case starts in a clean state.
   */
  beforeEach(() => {
    cy.visit("https://btwedutech.com/masuk");
  });

//   it("TC-LOGIN-02 - Email kosong", () => {
//     // Type only the password to trigger the email required validation.
//     cy.get(
//       '[data-testid="auth.login.password"], input[placeholder="Kata Sandi"]',
//     ).as("passwordInput");
//     cy.get("@passwordInput").type("invalidPassword");

//     // Click the submit button. Prefer a data-testid if available.
//     cy.get('[data-testid="auth.login.submit"], button')
//       .contains(/masuk|login/i)
//       .click();

//     // Assert that a validation message for the email field appears.
//     // Replace the selector/text below with the actual implementation once known.
//     cy.get('[data-testid="auth.login.validation.email"], .error, .input-error')
//       .should("be.visible")
//       .and("contain.text", "Email");

//     // The user should remain on the login page.
//     cy.url().should("include", "/masuk");
//   });

//   it("TC-LOGIN-03 - Password kosong", () => {
//     // Type only the email to trigger the password required validation.
//     cy.get('[data-testid="auth.login.email"], input[placeholder="Email"]').as(
//       "emailInput",
//     );
//     cy.get("@emailInput").type("user@example.com");

//     cy.get('[data-testid="auth.login.submit"], button')
//       .contains(/masuk|login/i)
//       .click();

//     // Assert that a validation message for the password field appears.
//     cy.get(
//       '[data-testid="auth.login.validation.password"], .error, .input-error',
//     )
//       .should("be.visible")
//       .and("contain.text", "Kata Sandi");

//     cy.url().should("include", "/masuk");
//   });

  it("TC-LOGIN-05 - Password salah", () => {
    // Enter a valid looking email with an incorrect password.
    cy.get('[data-testid="auth.login.email"], input[placeholder="Email"]').type(
      "user@example.com",
    );
    cy.get(
      '[data-testid="auth.login.password"], input[placeholder="Kata Sandi"]',
    ).type("wrongPassword");
    cy.get('[data-testid="auth.login.submit"], button')
      .contains(/masuk|login/i)
      .click();

    // Expect a credential error message to appear. Adjust selector/text as needed.
    cy.get('[data-testid="auth.login.error"], .toast, .alert')
      .should("be.visible")
      .and("contain.text", "salah");

    cy.url().should("include", "/masuk");
  });

  it("TC-LOGIN-01 - Login berhasil", () => {
    // For a successful login we need valid credentials. Use environment
    // variables or fixtures to avoid hard-coding secrets in the test.
    const email = Cypress.env("VALID_USER_EMAIL");
    const password = Cypress.env("VALID_USER_PASSWORD");

    // Guard against missing credentials to avoid false positives.
    expect(
      email,
      "valid email must be provided via CYPRESS_VALID_USER_EMAIL",
    ).to.be.a("string").and.not.be.empty;
    expect(
      password,
      "valid password must be provided via CYPRESS_VALID_USER_PASSWORD",
    ).to.be.a("string").and.not.be.empty;

    cy.get('[data-testid="auth.login.email"], input[placeholder="Email"]').type(
      email,
    );
    cy.get(
      '[data-testid="auth.login.password"], input[placeholder="Kata Sandi"]',
    ).type(password);
    cy.get('[data-testid="auth.login.submit"], button')
      .contains(/masuk|login/i)
      .click();

    // Upon successful login the user should be redirected away from the
    // login page. Adjust the expected path and indicator selector to
    // match the application. For example, verify a sidebar or user
    // dashboard element is visible.
    cy.url().should("not.include", "/masuk");

    // Assert that an element unique to the dashboard is visible. Update
    // the selector below once the dashboard’s markup is known.
    cy.get('[data-testid="dashboard.page"], .sidebar, nav').should(
      "be.visible",
    );
  });
});
