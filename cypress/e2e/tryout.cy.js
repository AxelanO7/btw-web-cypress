describe("Tryout Flow with Programmatic Login", () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";
  const captcha =
    "0.dJ5o3df9UZw2YWwt0Q-Lq6Yk9pCTw8gSrSJC6L3wfMTDXwfLQ5iZ3YTxjMsEkVymilTtM0Z-FYd2DjI7aDmrxXKcGg_dynGiTPhnBofhBv6UPUDCxALsHJE_tJX49vjGsIWP8hHGNJtUUvBZSpLMF2LpfaKB23HRxC9uI1S4Knt6WPghMfHk0607juFC5yCMmpWqZYrmMV9wK9VytAu3SuzgNMpNx8ea2MRJWjtL0gDCdy4Ar7dQI5R7SLCHjSyz6kEp3-HHP9P91ZOyEMvIImId_TsVaUyn12WQY3evux0bgFb3Jqds73HqzJWUDHkBAIQHBGwLHEz1KLUML38-8bU3dctn6Q-sFHNQTW2CL9niEwekVF7YJNMEcSBDeOUhitNvlpfffiZfzwxwSLKApiioD-I_J3yBlaop-1svEJjJJoE1d6yD7iXIXpu1n498Xpn3CuS8gEvGST0nCn5bv0-ATHEd7LjcyWQaD0Np59-qA0IiwcZBM424z2qScAhhdHX6qPO8bpHrOpNu_3v2IiUX58jfigc2fjrWE0srz9i7gkO86lqvhViGZz0LgVKwKKrliQABWzXtXUwqt6D9QKuvNDK6Sfu3tQiPhQa-r7cT-sMxIoFB_R9Q7ed6M6d0EVBX229oN1TeHuBz6XaswK7u2g8LfVL7BhuGXKyunq00YA4ABPYewPofeVWIZjJcq06Lo2Q2mD5-9uTmqEmLmYDaPiW55w3nOMRXQnXeokA7K8oBq6z2-T9nKkf7sjrMovTRIICmkYKkkKaTa9t7HbkGJ-iiGl2EfP8L58wV95zdMA1__8VA5PvG3ROHMdhzSBoLFHTU0UOpHMa6IpIiZ9VGIUvYkHBeOh9AG407NnLuntWTp2z9XFLQG9wFdYd_EYZG7DLMuDh4cUhaYxCo8CJVvurt2y36y6J6wcZPQyENJRJRtxtfJzPm38g3iQixV-yz3Et_NbNZ6KfeWZnCLNy25m5OA3-pI0dMd3SmGBc.czEPL5cebSKci9a7zEIv0w.cf409726a04df1fbd6ec7af32e6116a7379223185eac1e5fcbdd0ffebb90c8a4";

  beforeEach(() => {
    cy.login(email, password, captcha);
  });

  it("Should navigate to tryout page after successful login", () => {
    cy.visit("https://app-v4.btwazure.com/tryout", { timeout: 30000 });
    cy.url().should("include", "/tryout");

    cy.get("#root button:nth-child(1) p.text-xs").click();
    cy.get("#root button.bg-indigo-600").click();

    // Looping untuk semua pertanyaan tryout
    // Sesuaikan totalQuestions dengan jumlah soal sebenarnya pada tryout (misal: 155 untuk SNBT)
    const totalQuestions = 5;

    for (let i = 1; i <= totalQuestions; i++) {
      // Pastikan elemen opsi A muncul sebelum diklik
      cy.get(`#answer_${i}_A`, { timeout: 10000 }).should("exist");

      // Pilih opsi A dengan menggunakan force: true agar menghindari kendala elemen dalam (seperti div/label)
      cy.get("#btn-optionA-exam").click({ force: true, multiple: true });
      cy.get(`#answer_${i}_A`).check({ force: true });

      // Lanjut ke soal berikutnya jika bukan soal terakhir
      if (i < totalQuestions) {
        cy.get("#btn-next-exam").click();
      } else {
        // Action tambahan saat mencapai soal terakhir (misalnya untuk submit ujian)
        // cy.get('#btn-finish-exam').click();
      }
    }
  });
});
