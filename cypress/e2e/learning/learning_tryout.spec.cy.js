// Generated Cypress spec for BTW Edutech
// Refaktor untuk Tryout dinamis dan randomizer

const loginByUi = () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";
  const captcha =
    "0.dJ5o3df9UZw2YWwt0Q-Lq6Yk9pCTw8gSrSJC6L3wfMTDXwfLQ5iZ3YTxjMsEkVymilTtM0Z-FYd2DjI7aDmrxXKcGg_dynGiTPhnBofhBv6UPUDCxALsHJE_tJX49vjGsIWP8hHGNJtUUvBZSpLMF2LpfaKB23HRxC9uI1S4Knt6WPghMfHk0607juFC5yCMmpWqZYrmMV9wK9VytAu3SuzgNMpNx8ea2MRJWjtL0gDCdy4Ar7dQI5R7SLCHjSyz6kEp3-HHP9P91ZOyEMvIImId_TsVaUyn12WQY3evux0bgFb3Jqds73HqzJWUDHkBAIQHBGwLHEz1KLUML38-8bU3dctn6Q-sFHNQTW2CL9niEwekVF7YJNMEcSBDeOUhitNvlpfffiZfzwxwSLKApiioD-I_J3yBlaop-1svEJjJJoE1d6yD7iXIXpu1n498Xpn3CuS8gEvGST0nCn5bv0-ATHEd7LjcyWQaD0Np59-qA0IiwcZBM424z2qScAhhdHX6qPO8bpHrOpNu_3v2IiUX58jfigc2fjrWE0srz9i7gkO86lqvhViGZz0LgVKwKKrliQABWzXtXUwqt6D9QKuvNDK6Sfu3tQiPhQa-r7cT-sMxIoFB_R9Q7ed6M6d0EVBX229oN1TeHuBz6XaswK7u2g8LfVL7BhuGXKyunq00YA4ABPYewPofeVWIZjJcq06Lo2Q2mD5-9uTmqEmLmYDaPiW55w3nOMRXQnXeokA7K8oBq6z2-T9nKkf7sjrMovTRIICmkYKkkKaTa9t7HbkGJ-iiGl2EfP8L58wV95zdMA1__8VA5PvG3ROHMdhzSBoLFHTU0UOpHMa6IpIiZ9VGIUvYkHBeOh9AG407NnLuntWTp2z9XFLQG9wFdYd_EYZG7DLMuDh4cUhaYxCo8CJVvurt2y36y6J6wcZPQyENJRJRtxtfJzPm38g3iQixV-yz3Et_NbNZ6KfeWZnCLNy25m5OA3-pI0dMd3SmGBc.czEPL5cebSKci9a7zEIv0w.cf409726a04df1fbd6ec7af32e6116a7379223185eac1e5fcbdd0ffebb90c8a4";

  cy.login(email, password, captcha);
};

describe("Learning Tryout Module", () => {
  beforeEach(() => {
    // Langkah 1: Persiapan & Login
    loginByUi();

    // Setup intercept API untuk mendapatkan soal agar bisa diekstrak datanya nanti
    cy.intercept("POST", "**/w/v2/exam/get-questions*").as("getQuestions");

    // Navigasi ke halaman tryout secara langsung
    cy.visit("/tryout");
    cy.get("body", { timeout: 15000 }).should("be.visible");
  });

  it("Melakukan Pengerjaan Tryout Secara Dinamis dan Acak", () => {
    // Langkah 2: Navigasi Dinamis Berdasarkan Package ID
    const packageId = Cypress.env("TEST_PACKAGE_ID") || "SNBT PTN";

    // Cari kartu tryout yang relevan berdasarkan packageId dan klik kartu tersebut
    cy.contains(packageId, { timeout: 15000 }).should("be.visible").click();

    // Pastikan halaman Detail Modul berhasil termuat (menandakan list modul dapat terlihat)
    cy.get("body", { timeout: 15000 }).should("be.visible");

    // Langkah 3: Memilih Modul "Belum Dikerjakan"
    // Gunakan selector spesifik untuk mencari tombol "Kerjakan" pada modul yang tersedia
    cy.get("button.bg-indigo-600:contains('Kerjakan')", { timeout: 15000 })
      .should("be.visible")
      .first()
      .click();

    // Langkah 4: Logika Pengerjaan Soal dengan Randomizer (Sangat Krusial)
    // Menunggu request get-questions untuk mendeteksi jumlah soal yang sebenarnya
    cy.wait("@getQuestions", { timeout: 30000 }).then((interception) => {
      const responseBody = interception.response.body;
      let totalQuestions = 0;

      let questions = [];

      // Ekstraksi total pertanyaan (question_total) dan list pertanyaan dari payload response API
      if (responseBody && responseBody.data) {
        if (responseBody.data.subjects) {
          totalQuestions = responseBody.data.subjects.reduce(
            (acc, subject) => acc + (subject.question_total || 0),
            0,
          );
        }
        if (responseBody.data.questions) {
          questions = responseBody.data.questions;
        }
      }

      if (totalQuestions === 0) {
        // Default jika struktur response di luar dugaan
        totalQuestions = 30;
      }

      cy.log(`Jumlah soal yang akan dikerjakan: ${totalQuestions}`);

      // Iterasi for-loop untuk menjawab setiap nomor soal
      for (let i = 1; i <= totalQuestions; i++) {
        const questionData = questions[i - 1]; // Mengambil data soal saat ini
        const answerType = questionData
          ? questionData.answer_type
          : "MULTIPLE_CHOICES";

        // Tunggu komponen container jawaban muncul agar tidak flaky
        cy.get(".option-answer", { timeout: 15000 }).should("be.visible");

        if (answerType === "MULTIPLE_CHOICES") {
          // Randomizer jawaban (A, B, C, D, E)
          const options = ["A", "B", "C", "D", "E"];
          const randomAnswer =
            options[Math.floor(Math.random() * options.length)];

          cy.log(
            `Soal ke-${i} (MULTIPLE_CHOICES) dijawab dengan: ${randomAnswer}`,
          );

          cy.get("body").then(($body) => {
            // Klik tombol kontainer jawaban secara acak
            if ($body.find("#btn-option" + randomAnswer + "-exam").length > 0) {
              cy.get("#btn-option" + randomAnswer + "-exam").click({
                force: true,
                multiple: true,
              });
            }
            // Cek radio input sebagai fallback untuk memvalidasi input di sistem
            if ($body.find(`#answer_${i}_${randomAnswer}`).length > 0) {
              cy.get(`#answer_${i}_${randomAnswer}`).check({ force: true });
            }
          });
        } else if (answerType === "CHECKBOX") {
          cy.log(`Soal ke-${i} (CHECKBOX): Mencentang opsi`);
          const optionId = questionData.option_ids[0];

          cy.get("body").then(($body) => {
            if ($body.find(`[for="answer_${i}_${optionId}"]`).length > 0) {
              cy.get(`[for="answer_${i}_${optionId}"]`).click({ force: true });
            }
            if ($body.find(`#answer_${i}_${optionId}`).length > 0) {
              cy.get(`#answer_${i}_${optionId}`).check({ force: true });
            } else if ($body.find(`input[type="checkbox"]`).length > 0) {
              // Fallback
              cy.get(`input[type="checkbox"]`).first().check({ force: true });
            }
          });
        } else if (answerType === "PERNYATAAN") {
          cy.log(
            `Soal ke-${i} (PERNYATAAN): Memilih Benar/Salah untuk setiap pernyataan`,
          );
          if (questionData.option_ids && questionData.option_ids.length > 0) {
            questionData.option_ids.forEach((optId) => {
              const ab = Math.random() < 0.5 ? "a" : "b"; // secara acak pilih benar (a) atau salah (b)
              cy.get("body").then(($body) => {
                // Radio untuk id="answer_a_30_48888" atau "answer_b_30_48888"
                if ($body.find(`#answer_${ab}_${i}_${optId}`).length > 0) {
                  cy.get(`#answer_${ab}_${i}_${optId}`).check({ force: true });
                } else if (
                  $body.find(`[for="answer_${ab}_${i}_${optId}"]`).length > 0
                ) {
                  cy.get(`[for="answer_${ab}_${i}_${optId}"]`).click({
                    force: true,
                  });
                }
              });
            });
          }
        } else {
          // Generic fallback logic apabila ada tipe soal lainnya
          cy.get("body").then(($body) => {
            if ($body.find('input[type="radio"]').length > 0) {
              cy.get('input[type="radio"]').first().check({ force: true });
            } else if ($body.find('input[type="checkbox"]').length > 0) {
              cy.get('input[type="checkbox"]').first().check({ force: true });
            }
          });
        }

        // Evaluasi apakah berada di soal terakhir atau tidak
        if (i < totalQuestions) {
          // Navigasi ke soal selanjutnya jika belum selesai
          cy.get("#btn-next-exam", { timeout: 15000 })
            .should("be.visible")
            .click({ force: true });
        } else {
          // Langkah 5: Submit Ujian (Selesai) pada interasi terakhir
          cy.get("body").then(($body) => {
            // Gunakan selector fleksibel apabila struktur ID berbeda sewaktu-waktu
            if ($body.find("#btn-finish-exam").length > 0) {
              cy.get("#btn-finish-exam").click({ force: true });
            } else {
              cy.contains("Selesai Ujian", { timeout: 15000 }).click({
                force: true,
              });
            }
          });

          // Tangani modal konfirmasi ("Yakin")
          cy.contains("Yakin", { timeout: 15000 })
            .should("be.visible")
            .click({ force: true });

          // Asersi bahwa user tidak lagi di state ujian (elemen ujian sudah tidak ada/hilang)
          cy.contains("Selesai Ujian", { timeout: 15000 }).should("not.exist");
        }
      }
    });
  });
});
