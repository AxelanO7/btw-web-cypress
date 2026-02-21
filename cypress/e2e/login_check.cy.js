describe("Dashboard Check with Programmatic Login", () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";

  beforeEach(() => {
    // cy.login() menggunakan cy.session() di dalamnya.
    // Login API hanya akan dipanggil sekali untuk kredensial yang sama,
    // pengujian selanjutnya akan me-restore session dari cache.
    cy.login(email, password);
  });

  it("Harus bisa membuka halaman utama dan melanjutkan ke test pembayaran", () => {
    // Setelah session di-restore (atau setelah login API sukses),
    // arahkan langsung ke halaman utama.
    cy.visit("https://app-v4.btwazure.com/");

    // Verifikasi bahwa URL sudah benar
    cy.url().should("eq", "https://app-v4.btwazure.com/");

    // Anda dapat menambahkan assertion yang menandakan login berhasil di UI (seperti foto profil, menu tertentu)
    // cy.get('.profile-menu').should('be.visible');

    // Jika ada elemen profil:
    // cy.get('.profile-container').should('be.visible');
    // cy.get('.user-balance').should('exist');
  });

  it("Test case kedua untuk mendemonstrasikan session", () => {
    // Pada test case kedua ini, API login TIDAK akan dipanggil lagi.
    // Cypress akan langsung me-restore token/cookie dari session.
    cy.visit("https://app-v4.btwazure.com/");
    cy.url().should("eq", "https://app-v4.btwazure.com/");
  });
});
