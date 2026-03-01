// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add("login", (email, password, captchaCode) => {
  cy.session(
    [email, password, captchaCode],
    () => {
      // Perform programmatic login via API to bypass Cloudflare Captcha
      cy.request({
        method: "POST",
        url: "https://api-v2.btwazure.com/w/v2/auth/login",
        body: {
          username: email,
          password: password,
          captcha_code: captchaCode,
        },
      }).then((response) => {
        // Pastikan response berhasil
        expect(response.status).to.eq(200);

        // Cypress cy.session() mulai dari "about:blank".
        // Agar localStorage tersimpan di domain yang benar, kita harus visit dulu (meski tidak login),
        cy.visit("https://app-v4.btwazure.com/");

        // Simpan token dan refresh_token ke localStorage sesuai screenshot
        cy.window().then((window) => {
          // Response payload biasanya ada di response.body atau response.body.data
          const data = response.body.data || response.body;
          const token = data.token;
          const refresh_token = data.refresh_token;

          if (token) {
            window.localStorage.setItem("token", token);
          } else {
            cy.log("WARNING: Token tidak ditemukan di payload API response!");
          }

          if (refresh_token) {
            window.localStorage.setItem("refresh_token", refresh_token);
          } else {
            cy.log(
              "WARNING: Refresh Token tidak ditemukan di payload API response!",
            );
          }
        });
      });
    },
    {
      validate() {
        // Validasi tambahan untuk memastikan session masih aktif
        // Buka halaman utama karena /dashboard tidak diwajibkan
        cy.visit("https://app-v4.btwazure.com/");
        // Pastikan halaman tidak redirect ke halaman login
        cy.url().should("not.include", "/masuk");
      },
    },
  );
});
