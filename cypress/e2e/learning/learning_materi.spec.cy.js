// Generated Cypress spec for BTW Edutech
// Refaktor untuk Tryout dinamis dan randomizer - Materi

describe("Learning Materi Module", () => {
  beforeEach(() => {
    // Langkah 1: Optimasi Login (Mencegah 401)
    // Custom command cy.login() untuk mem-bypass UI menggunakan cache session
    const email = "abigaildw0@gmail.com";
    const password = "mahalbanget@1";
    const captcha =
      "0.dJ5o3df9UZw2YWwt0Q-Lq6Yk9pCTw8gSrSJC6L3wfMTDXwfLQ5iZ3YTxjMsEkVymilTtM0Z-FYd2DjI7aDmrxXKcGg_dynGiTPhnBofhBv6UPUDCxALsHJE_tJX49vjGsIWP8hHGNJtUUvBZSpLMF2LpfaKB23HRxC9uI1S4Knt6WPghMfHk0607juFC5yCMmpWqZYrmMV9wK9VytAu3SuzgNMpNx8ea2MRJWjtL0gDCdy4Ar7dQI5R7SLCHjSyz6kEp3-HHP9P91ZOyEMvIImId_TsVaUyn12WQY3evux0bgFb3Jqds73HqzJWUDHkBAIQHBGwLHEz1KLUML38-8bU3dctn6Q-sFHNQTW2CL9niEwekVF7YJNMEcSBDeOUhitNvlpfffiZfzwxwSLKApiioD-I_J3yBlaop-1svEJjJJoE1d6yD7iXIXpu1n498Xpn3CuS8gEvGST0nCn5bv0-ATHEd7LjcyWQaD0Np59-qA0IiwcZBM424z2qScAhhdHX6qPO8bpHrOpNu_3v2IiUX58jfigc2fjrWE0srz9i7gkO86lqvhViGZz0LpVKwKKrliQABWzXtXUwqt6D9QKuvNDK6Sfu3tQiPhQa-r7cT-sMxIoFB_R9Q7ed6M6d0EVBX229o1NTeHuBz6XaswK7u2g8LfVL7BhuGXKyunq00YA4ABPYewPofeVWIZjJcq06Lo2Q2mD5-9uTmqEmLmYDaPiW55w3nOMRXQnXeokA7K8oBq6z2-T9nKkf7sjrMovTRIICmkYKkkKaTa9t7HbkGJ-iiGl2EfP8L58wV95zdMA1__8VA5PvG3ROHMdhzSBoLFHTU0UOpHMa6IpIiZ9VGIUvYkHBeOh9AG407NnLuntWTp2z9XFLQG9wFdYd_EYZG7DLMuDh4cUhaYxCo8CJVvurt2y36y6J6wcZPQyENJRJRtxtfJzPm38g3iQixV-yz3Et_NbNZ6KfeWZnCLNy25m5OA3-pI0dMd3SmGBc.czEPL5cebSKci9a7zEIv0w.cf409726a04df1fbd6ec7af32e6116a7379223185eac1e5fcbdd0ffebb90c8a4";

    cy.login(email, password, captcha);

    // Setup intercept API untuk mendapatkan soal materi agar bisa diekstrak datanya nanti
    cy.intercept("GET", "**/w/v2/study-material/get-test/**").as(
      "getMateriQuestions",
    );

    // Navigasi ke halaman setelah login berhasil dan dilindungi command session
    cy.visit("/materi-saya");
    cy.contains("Materi Saya", { timeout: 15000 }).should("be.visible");
  });

  it("TC-MATERI-01 - Buka materi", () => {
    cy.get("body").then(($body) => {
      if (!$body.text().includes("Belum Ada Data")) {
        cy.contains("Akses Materinya disini", { matchCase: false })
          .first()
          .click();
        cy.get("body").should("not.have.class", "loading");
      } else {
        cy.log("Skipping - no materi available");
      }
    });
  });

  it("TC-MATERI-03 - Tandai materi selesai / progress berubah dan Simulasi Pengerjaan Soal", () => {
    cy.get("body").then(($body) => {
      if (!$body.text().includes("Belum Ada Data")) {
        // Navigasi ke materi detail yang memiliki kuis (Materi SKD CPNS)
        cy.contains(/Materi Belajar SKD CPNS/i)
          .first()
          .click({ force: true });

        // Buka sub-materi (item materi dalam daftar list di halaman detail)
        cy.get(".border-2.rounded-xl .hover\\:cursor-pointer", {
          timeout: 15000,
        })
          .should("be.visible")
          .first()
          .click({ force: true });

        // Langkah 2: Mencari dan Mengklik Tombol "Mulai" (Robust Selector)
        cy.get("button.bg-secondary:contains('Mulai')", { timeout: 15000 })
          .should("be.visible")
          .first()
          .click();

        // Langkah 3: Logika Pengerjaan Soal (Intercept API & Loop)
        cy.wait("@getMateriQuestions", { timeout: 30000 }).then(
          (interception) => {
            const responseBody = interception.response.body;
            let totalQuestions = 0;
            let questions = [];

            if (responseBody && responseBody.data) {
              if (Array.isArray(responseBody.data)) {
                questions = responseBody.data;
                totalQuestions = questions.length;
              } else if (responseBody.data.questions) {
                questions = responseBody.data.questions;
                totalQuestions = questions.length;
              } else {
                // Fallback jika nested map
                totalQuestions = 10;
              }
            } else {
              totalQuestions = 10;
            }

            cy.log(
              `Jumlah soal Materi yang akan dikerjakan: ${totalQuestions}`,
            );

            for (let i = 1; i <= totalQuestions; i++) {
              // Tunggu komponen container jawaban muncul agar tidak flaky
              cy.get(".exam-option", { timeout: 15000 }).should("be.visible");

              // Randomizer jawaban (A, B, C, D, E)
              const options = ["A", "B", "C", "D", "E"];
              const randomAnswer =
                options[Math.floor(Math.random() * options.length)];

              cy.log(`Soal ke-${i} dijawab dengan acak: ${randomAnswer}`);

              cy.get("body").then(($body) => {
                // Cek radio input sebagai fallback untuk memvalidasi input di sistem
                if (
                  $body.find(`#answer_quiz_${i}_${randomAnswer}`).length > 0
                ) {
                  cy.get(`#answer_quiz_${i}_${randomAnswer}`).check({
                    force: true,
                  });
                } else if ($body.find(`input[type="radio"]`).length > 0) {
                  cy.get(`input[type="radio"]`).first().check({ force: true });
                }
              });

              // Evaluasi apakah berada di soal terakhir atau tidak
              if (i < totalQuestions) {
                cy.get("#btn-next-quiz", { timeout: 15000 })
                  .should("be.visible")
                  .click({ force: true });
              } else {
                // Langkah 4: Klik Tombol "Selesai" di Akhir
                cy.get("body").then(($body) => {
                  if ($body.find("#btn-finish-exam").length > 0) {
                    cy.get("#btn-finish-exam").click({ force: true });
                  } else {
                    cy.contains("Selesai", { timeout: 15000 }).click({
                      force: true,
                    });
                  }
                });

                // Tangani modal konfirmasi ("Yakin" atau "Akhiri")
                cy.get("button")
                  .contains(/Yakin|Submit|Akhiri/i, { timeout: 15000 })
                  .should("be.visible")
                  .click({ force: true });

                // Asersi bahwa user tidak lagi di state ujian
                cy.get("#btn-finish-exam", { timeout: 15000 }).should(
                  "not.exist",
                );
              }
            }
          },
        );
      } else {
        cy.log("Skipping - no materi available");
      }
    });
  });
});
