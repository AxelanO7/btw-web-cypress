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
        url: "https://api-v2.btwazure.com/w/v2/auth/login",
        body: {
          username: email,
          password: password,
          captcha_code:
            "0.tHl9hZkDBU445EDgSMPn6ZIHgW_WkQzJUYJGrDFDSiKf0phtONiw_buiTu36VgSU5Ahm_PScVtkl5qFGf08w5gpHLQnN_06GHuVW5UfQRpp0H2oiXoCV1Lg-HN77PXCHAMgyOnh_pmAfIGx1Yb7_pnHHzUiuNRos_U06m4yV4wY7MGc40uet6vJ8o5qJ7h0GQlPK9VRLDNPSzYrGPzVZPWJmcF9SvnDqK75wMBEXjffcaLx4GW7W__4FKZBenhCOYL3oMM6rlM6lZYLP0TFJTXFz5ylmcUucw5S2p4zM5t6heSFlLpT_M6t9BvhEHvLjH0MhtLkrdxvrkPN7xWMK5K6imHLr8MylsyNzaLry0IkxeVa0p_YGTLKi0xuILQ44Zgoml0l8Rv4MNLbljtxOhTQiTxT2JqXg1xNPiJQNHWLCkOqdCZNkPH6bK8sK-pOVX1J_QH7wy2dswXtta9oFrT9O8aR4VFNTXzbbnIau6CvJOnmcCiCP98_n-k1F0pKUlTPdIDtdGA7Xrx8bH3aynL9SauOFQC6IvE8Fo6TZKJElzlv3XDQNepWTJ4bFTSTZOs5fp_HF1zjr6HKCNbJD3xCheRUKmsmPVpwnM8cR_yVkvMwEgRUb9gPFPdVNENq0wcfi-I51tHSnxe1rILfJBNX632Z3YmHNXjnEPJYaZNAvl1p0dQSCvYZSUWZnzXrDeFgjh7_4djlyA-5p8-iTbOxuolIFcMvL9RrK00whhGR-mm7bBfSYBiJEtT82tqOHrTmUv3Gb4NCimL7f4kIxdFg-SYT2_nadvafQk1x1WJAZMRBdQFEVOgUwm4tL5NL4p5Rcv5BHuneiOOz5TmvXh8UOYRPlUcFEdDW_6JOAHP7UAGxIbP4J8ejALTi0ZU_O1mM02JJGu_hykHY_y_n9iSKSg3YrQ7_OZlp0etLnNbdlkD5Pd9Cz-Ige1XfaRhN-.UOJClnqsExUGyHlnfrfATg.cf1fcd1434f33baca668e2a6c6369f3850d65daa3c2cf6fb5b1814835027efb4",
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
        // Buka halaman utama karena /dashboard tidak diwajibkan
        cy.visit("https://app-v4.btwazure.com/");
        // Pastikan halaman tidak redirect ke halaman login
        cy.url().should("not.include", "/masuk");
      },
    },
  );
});
