describe("SKD Tryout Product Purchase", () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";

  beforeEach(() => {
    // Call the custom login command using cy.session()
    cy.login(email, password);
  });

  it("Should be able to select SKD CPNS product and proceed to payment", () => {
    // 1. Visit the Homepage
    cy.visit("https://app-v4.btwazure.com/", { timeout: 30000 });
    cy.url().should("eq", "https://app-v4.btwazure.com/");

    // 2. Click on the 'Beli' (Buy) menu in the navigation / sidebar
    // Constraint: Use .should('be.visible') with sufficient timeout for important elements.
    cy.contains("Beli", { timeout: 15000 }).should("be.visible").click();

    // 3. Verify that we have navigated to the purchase page
    cy.url().should("include", "/beli");

    // 4. Select the 'SKD CPNS' product
    // Ensure the product list has been rendered by the DOM
    cy.contains("SKD CPNS", { timeout: 15000 }).should("be.visible").click();

    // 5. Click the 'Pilih' (Select) button on the detail modal / page
    cy.contains("Pilih", { timeout: 10000 }).should("be.visible").click();

    // 6. Verify until the payment summary or shopping cart appears
    // Ensure we are on the checkout / payment / cart page
    cy.url().should("match", /\/(checkout|pembayaran|cart)/);
  });
});
