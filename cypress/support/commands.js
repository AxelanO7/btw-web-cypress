// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("login", (email, password) => {
  cy.session(
    [email, password],
    () => {
      // Perform programmatic login via API to bypass Cloudflare Captcha
      // Replace the URL with the actual login API endpoint of Btwedutech
      cy.request({
        method: "POST",
        url: "https://api.btwedutech.com/v1/auth/login", // <-- SESUAIKAN DENGAN ENDPOINT API ASLI
        body: {
          email: email,
          password: password,
        },
      }).then((response) => {
        // Pastikan response berhasil
        expect(response.status).to.eq(200);

        // Simpan token ke localStorage/cookie tergantung implementasi aplikasi
        // Contoh jika aplikasi menggunakan localStorage:
        const token = response.body.token || response.body.data.token;
        window.localStorage.setItem("auth_token", token);

        // Jika aplikasi menggunakan cookie, gunakan cy.setCookie
        // cy.setCookie('session_id', token);
      });
    },
    {
      validate() {
        // Validasi tambahan untuk memastikan session masih aktif
        // Buka halaman yang hanya bisa diakses jika sudah login
        cy.visit("https://app-v4.btwazure.com/dashboard");
        // Pastikan halaman tidak redirect ke halaman login
        cy.url().should("not.include", "/masuk");
      },
    },
  );
});
