// Cypress E2E spec for BTW Edutech - Auth Logout Module
// The logout button is on the /profil page, labeled "Keluar"

const loginByUi = () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";
  const captcha =
    "0.dJ5o3df9UZw2YWwt0Q-Lq6Yk9pCTw8gSrSJC6L3wfMTDXwfLQ5iZ3YTxjMsEkVymilTtM0Z-FYd2DjI7aDmrxXKcGg_dynGiTPhnBofhBv6UPUDCxALsHJE_tJX49vjGsIWP8hHGNJtUUvBZSpLMF2LpfaKB23HRxC9uI1S4Knt6WPghMfHk0607juFC5yCMmpWqZYrmMV9wK9VytAu3SuzgNMpNx8ea2MRJWjtL0gDCdy4Ar7dQI5R7SLCHjSyz6kEp3-HHP9P91ZOyEMvIImId_TsVaUyn12WQY3evux0bgFb3Jqds73HqzJWUDHkBAIQHBGwLHEz1KLUML38-8bU3dctn6Q-sFHNQTW2CL9niEwekVF7YJNMEcSBDeOUhitNvlpfffiZfzwxwSLKApiioD-I_J3yBlaop-1svEJjJJoE1d6yD7iXIXpu1n498Xpn3CuS8gEvGST0nCn5bv0-ATHEd7LjcyWQaD0Np59-qA0IiwcZBM424z2qScAhhdHX6qPO8bpHrOpNu_3v2IiUX58jfigc2fjrWE0srz9i7gkO86lqvhViGZz0LgVKwKKrliQABWzXtXUwqt6D9QKuvNDK6Sfu3tQiPhQa-r7cT-sMxIoFB_R9Q7ed6M6d0EVBX229oN1TeHuBz6XaswK7u2g8LfVL7BhuGXKyunq00YA4ABPYewPofeVWIZjJcq06Lo2Q2mD5-9uTmqEmLmYDaPiW55w3nOMRXQnXeokA7K8oBq6z2-T9nKkf7sjrMovTRIICmkYKkkKaTa9t7HbkGJ-iiGl2EfP8L58wV95zdMA1__8VA5PvG3ROHMdhzSBoLFHTU0UOpHMa6IpIiZ9VGIUvYkHBeOh9AG407NnLuntWTp2z9XFLQG9wFdYd_EYZG7DLMuDh4cUhaYxCo8CJVvurt2y36y6J6wcZPQyENJRJRtxtfJzPm38g3iQixV-yz3Et_NbNZ6KfeWZnCLNy25m5OA3-pI0dMd3SmGBc.czEPL5cebSKci9a7zEIv0w.cf409726a04df1fbd6ec7af32e6116a7379223185eac1e5fcbdd0ffebb90c8a4";

  cy.login(email, password, captcha);
};

describe("Auth Logout Module", () => {
  beforeEach(() => {
    loginByUi();
  });

  it("TC-LOGOUT-01 - Logout berhasil", () => {
    // Navigate to profile page where the logout button lives
    cy.visit("/profil");
    cy.contains("Profil Saya").should("be.visible");

    // Click the "Keluar" button
    cy.contains("button", "Keluar").should("be.visible").click();

    // Handle potential confirmation dialog
    cy.get("body").then(($body) => {
      if (
        $body.find('button:contains("Ya")').length ||
        $body.find('button:contains("Keluar")').length > 1
      ) {
        // If a confirmation dialog appeared, click the confirm button
        cy.contains("button", "Ya").click({ timeout: 5000 });
      }
    });

    // Should redirect to login page
    cy.url({ timeout: 15000 }).should("include", "/masuk");
  });

  it("TC-LOGOUT-02 - Session dibersihkan setelah logout", () => {
    // Navigate to profile page where the logout button lives
    cy.visit("/profil");
    cy.contains("Profil Saya").should("be.visible");

    // Click the "Keluar" button
    cy.contains("button", "Keluar").should("be.visible").click();

    // Handle potential confirmation dialog
    cy.get("body").then(($body) => {
      if (
        $body.find('button:contains("Ya")').length ||
        $body.find('button:contains("Keluar")').length > 1
      ) {
        cy.contains("button", "Ya").click({ timeout: 5000 });
      }
    });

    // Should redirect to login page
    cy.url({ timeout: 15000 }).should("include", "/masuk");

    // After logout, reloading should stay on the login page (session is cleared)
    cy.reload();
    cy.url().should("include", "/masuk");
  });
});
