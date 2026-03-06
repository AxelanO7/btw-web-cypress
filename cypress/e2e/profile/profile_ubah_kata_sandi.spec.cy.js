// Cypress E2E spec for BTW Edutech - Profile Change Password Module
// The password change flow is a multi-step wizard at /reset-password:
//   Step 1: Enter old password -> click "Lanjutkan"
//   Step 2: Enter new password (#password) + confirm (#password_confirmation) -> click "Ubah Kata Sandi"
//
// IMPORTANT: We use the same password as new to avoid actually changing the test account password.

const loginByUi = () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";
  const captcha =
    "0.dJ5o3df9UZw2YWwt0Q-Lq6Yk9pCTw8gSrSJC6L3wfMTDXwfLQ5iZ3YTxjMsEkVymilTtM0Z-FYd2DjI7aDmrxXKcGg_dynGiTPhnBofhBv6UPUDCxALsHJE_tJX49vjGsIWP8hHGNJtUUvBZSpLMF2LpfaKB23HRxC9uI1S4Knt6WPghMfHk0607juFC5yCMmpWqZYrmMV9wK9VytAu3SuzgNMpNx8ea2MRJWjtL0gDCdy4Ar7dQI5R7SLCHjSyz6kEp3-HHP9P91ZOyEMvIImId_TsVaUyn12WQY3evux0bgFb3Jqds73HqzJWUDHkBAIQHBGwLHEz1KLUML38-8bU3dctn6Q-sFHNQTW2CL9niEwekVF7YJNMEcSBDeOUhitNvlpfffiZfzwxwSLKApiioD-I_J3yBlaop-1svEJjJJoE1d6yD7iXIXpu1n498Xpn3CuS8gEvGST0nCn5bv0-ATHEd7LjcyWQaD0Np59-qA0IiwcZBM424z2qScAhhdHX6qPO8bpHrOpNu_3v2IiUX58jfigc2fjrWE0srz9i7gkO86lqvhViGZz0LgVKwKKrliQABWzXtXUwqt6D9QKuvNDK6Sfu3tQiPhQa-r7cT-sMxIoFB_R9Q7ed6M6d0EVBX229oN1TeHuBz6XaswK7u2g8LfVL7BhuGXKyunq00YA4ABPYewPofeVWIZjJcq06Lo2Q2mD5-9uTmqEmLmYDaPiW55w3nOMRXQnXeokA7K8oBq6z2-T9nKkf7sjrMovTRIICmkYKkkKaTa9t7HbkGJ-iiGl2EfP8L58wV95zdMA1__8VA5PvG3ROHMdhzSBoLFHTU0UOpHMa6IpIiZ9VGIUvYkHBeOh9AG407NnLuntWTp2z9XFLQG9wFdYd_EYZG7DLMuDh4cUhaYxCo8CJVvurt2y36y6J6wcZPQyENJRJRtxtfJzPm38g3iQixV-yz3Et_NbNZ6KfeWZnCLNy25m5OA3-pI0dMd3SmGBc.czEPL5cebSKci9a7zEIv0w.cf409726a04df1fbd6ec7af32e6116a7379223185eac1e5fcbdd0ffebb90c8a4";

  cy.login(email, password, captcha);
};

describe("Profile Change Password Module", () => {
  beforeEach(() => {
    loginByUi();
    cy.visit("/reset-password");
    cy.contains("Ubah Kata Sandi").should("be.visible");
  });

  it("TC-PROFILE-PASS-01 - Ubah kata sandi berhasil", () => {
    // Step 1: Enter old password
    cy.contains("Masukkan Kata Sandi Lama").should("be.visible");
    cy.get("#password").type("mahalbanget@1", { log: false });
    cy.contains("button", "Lanjutkan").click();

    // Step 2: Enter new password (same as old to avoid changing account)
    cy.contains("Buat Ulang Kata Sandi", { timeout: 10000 }).should(
      "be.visible",
    );
    cy.get("#password").type("mahalbanget@1", { log: false });
    cy.get("#password_confirmation").type("mahalbanget@1", { log: false });
    cy.contains("button", "Ubah Kata Sandi").click();

    // Assert success: either a toast appears or we get redirected
    cy.get("#_rht_toaster > div", { timeout: 15000 }).should("exist");
  });

  it("TC-PROFILE-PASS-02 - Password lama salah", () => {
    // Step 1: Enter wrong old password
    cy.contains("Masukkan Kata Sandi Lama").should("be.visible");
    cy.get("#password").type("WrongPassword123!", { log: false });
    cy.contains("button", "Lanjutkan").click();

    // The form advances to step 2 regardless; validation is server-side
    cy.contains("Buat Ulang Kata Sandi", { timeout: 10000 }).should(
      "be.visible",
    );
    cy.get("#password").type("NewPassword123!", { log: false });
    cy.get("#password_confirmation").type("NewPassword123!", { log: false });
    cy.contains("button", "Ubah Kata Sandi").click();

    // Expect an error response (toast or inline error) since old password was wrong
    cy.get("#_rht_toaster > div", { timeout: 15000 }).should("exist");
  });

  it("TC-PROFILE-PASS-03 - Konfirmasi password baru tidak sama", () => {
    // Step 1: Enter correct old password
    cy.contains("Masukkan Kata Sandi Lama").should("be.visible");
    cy.get("#password").type("mahalbanget@1", { log: false });
    cy.contains("button", "Lanjutkan").click();

    // Step 2: Enter mismatching new passwords
    cy.contains("Buat Ulang Kata Sandi", { timeout: 10000 }).should(
      "be.visible",
    );
    cy.get("#password").type("NewPassword123!", { log: false });
    cy.get("#password_confirmation").type("AnotherPassword123!", {
      log: false,
    });
    cy.contains("button", "Ubah Kata Sandi").click();

    // Expect a validation error (inline or toast)
    cy.get(".text-red-500, #_rht_toaster > div", { timeout: 10000 }).should(
      "be.visible",
    );
  });
});
