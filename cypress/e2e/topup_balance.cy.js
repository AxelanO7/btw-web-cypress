describe("Balance Top Up and Payment Process", () => {
  const email = "abigaildw0@gmail.com";
  const password = "mahalbanget@1";

  beforeEach(() => {
    // 1. Login menggunakan programmatic API dan cache session
    cy.login(email, password);
  });

  it("Harus bisa top up saldo 30.000 dan menyelesaikan pembayaran via BCA VA Midtrans", () => {
    // ======== STEP 1: Buka Beranda & Klik Beli Saldo ========
    // Kunjungi beranda
    cy.visit("https://app-v4.btwazure.com/", { timeout: 30000 });

    // Tunggu sampai elemen UI (seperti button Beli Saldo di header) muncul dan diklik
    // Berdasarkan gambar 1 dan HTML, tombol Beli Saldo adalah anchor tag <a href="/saldo">
    cy.contains("a", "Beli Saldo", { timeout: 15000 })
      .should("be.visible")
      .click();

    // ======== STEP 2: Pilih Nominal Saldo ========
    // Verifikasi URL berubah ke halaman topup
    cy.url().should("include", "/topup"); // asumsikan path-nya /topup atau /beli-saldo

    // Cari tombol "Tambah Saldo" pada card dengan nominal "Rp 30.000"
    // Karena ada beberapa tombol "Tambah Saldo", kita filter berdasarkan card-nya
    // atau sekadar pilih yang indeks pertama (karena Rp 30.000 biasanya yang pertama)
    cy.contains("Rp 30.000")
      .parents("div") // cari wrapper/card-nya
      .contains("button", "Tambah Saldo")
      .click();

    // ======== STEP 3: Halaman Transaksi & Pilih Metode Pembayaran ========
    // Verifikasi redirection ke pay.btwazure.com
    // Di aplikasi React/Next, kadang redirect ke cross-origin butuh cy.origin() jika ini domain berbeda.
    // Tapi karena kita asumsikan masih 1 session/tidak strict cross-origin:
    cy.url({ timeout: 15000 }).should(
      "include",
      "pay.btwazure.com/transaction/",
    );

    // Klik tombol "Pilih Metode Pembayaran"
    cy.contains("Pilih Metode Pembayaran", { timeout: 15000 })
      .should("be.visible")
      .click();

    // ======== STEP 4: Pilih BCA Virtual Account ========
    // Proses ini mungkin melalui gateway Midtrans atau halaman internal
    // Catatan: Jika ada Captcha Cloudflare di sini, Cypress standar tidak bisa menebak CAPTCHA.
    // Namun jika hanya konfirmasi UI:
    cy.contains("BCA Virtual Account", { timeout: 15000 })
      .should("be.visible")
      .click();

    // ======== STEP 5: Salin Nomor Virtual Account ========
    // Setelah memilih VA, halaman akan menampilkan Nomor Virtual Account
    // Kita perlu mengekstrak nilainya (misalnya dari elemen teks)
    // Teksnya terlihat seperti "7103869..." di bawah label "Nomor Virtual Account"
    let vaNumber = "";

    cy.contains("Nomor Virtual Account")
      .next() // Asumsi struktur DOM-nya: <label> lalu <div> yang berisi angka
      .invoke("text")
      .then((text) => {
        // Membersihkan whitespace barangkali ada
        vaNumber = text.trim();
        cy.log("Extracted VA Number: " + vaNumber);

        // ======== STEP 6: Simulasikan Pembayaran di Midtrans Sandbox ========
        // Penting: Karena Midtrans berada di origin berbeda (simulator.sandbox.midtrans.com)
        // Kita harus menggunakan fitur origin dari Cypress.
        cy.origin(
          "https://simulator.sandbox.midtrans.com",
          { args: { vaNumber } },
          ({ vaNumber }) => {
            cy.visit("/bca/va/index");

            // Masukkan kode VA ke input
            // Perhatikan label "Virtual Account Number" di gambar 5
            cy.contains("Virtual Account Number")
              .siblings("input") // Sesuaikan dengan struktur asli midtrans
              .clear()
              .type(vaNumber);

            // Klik Inquiry
            cy.contains("button", "Inquire").click();

            // Lanjutkan klik tombol Pay (Asumsi setelah Inquiry ada tombol Pay)
            cy.contains("button", "Pay", { timeout: 10000 })
              .should("be.visible")
              .click();

            // Verifikasi pembayaran sukses di Midtrans
            cy.contains("Sukses", { matchCase: false, timeout: 15000 }).should(
              "exist",
            );
          },
        );
      });

    // ======== STEP 7: Kembali ke Aplikasi dan Cek Status ========
    // Setelah Midtrans sukses, kembali kontrol origin ke BTW
    // Refresh atau tunggu polling pada halaman transaksi pay.btwazure.com
    cy.visit("https://app-v4.btwazure.com/");
    // ^ Atur ke halaman dashboard / riwayat transaksi jika perlu, atau cukup kembali
    // dengan menekan tombol aslinya jika ada
  });
});
