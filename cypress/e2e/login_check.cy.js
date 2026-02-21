describe("Login Check with Programmatic Login", () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";

  beforeEach(() => {
    // cy.login() uses cy.session() internally.
    cy.login(email, password);
  });

  it("Should navigate to homepage after successful login", () => {
    // After session is restored, directly go to the homepage.
    cy.visit("https://app-v4.btwazure.com/", { timeout: 30000 });

    // Verify the URL is correct
    cy.url().should("eq", "https://app-v4.btwazure.com/");
  });

  it("Second test case to demonstrate session caching mechanism", () => {
    // In this second test case, the login API will NOT be called again.
    // Cypress will instantly restore the cached session token/cookie.
    cy.visit("https://app-v4.btwazure.com/", { timeout: 30000 });
    cy.url().should("eq", "https://app-v4.btwazure.com/");
  });
});
