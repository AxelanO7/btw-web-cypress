describe("Dashboard Check with Programmatic Login", () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";

  beforeEach(() => {
    // cy.login() menggunakan cy.session() di dalamnya.
    // Login API hanya akan dipanggil sekali untuk kredensial yang sama,
    // pengujian selanjutnya akan me-restore session dari cache.
    cy.login(email, password);
  });

  it("Harus bisa membuka dashboard dan memverifikasi elemen pengguna", () => {
    // Setelah session di-restore (atau setelah login API sukses),
    // arahkan langsung ke halaman dashboard.
    cy.visit("https://app-v4.btwazure.com/dashboard");

    // Verifikasi bahwa URL sudah benar
    cy.url().should("include", "/dashboard");

    // Contoh verifikasi sederhana bahwa kita berhasil masuk.
    // Sesuaikan selector (.profile-name, .balance, dsb) dengan struktur asli aplikasi.
    cy.get("body").should("contain", "Dashboard");

    // Jika ada elemen profil:
    // cy.get('.profile-container').should('be.visible');
    // cy.get('.user-balance').should('exist');
  });

  it("Test case kedua untuk mendemonstrasikan session", () => {
    // Pada test case kedua ini, API login TIDAK akan dipanggil lagi.
    // Cypress akan langsung me-restore token/cookie dari session.
    cy.visit("https://app-v4.btwazure.com/dashboard");
    cy.url().should("include", "/dashboard");
  });
});
