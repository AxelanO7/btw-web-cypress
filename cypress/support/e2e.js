// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  // This is useful since Next.js/React apps might throw 401 AxiosErrors which aren't Cypress test failures.
  return false;
});

// Membuat array untuk menampung riwayat API selama 1 test berjalan
let apiLogs = [];

beforeEach(() => {
  apiLogs = []; // Reset log setiap kali test baru dimulai

  // Intercept semua request ke backend API (sesuaikan polanya jika perlu)
  cy.intercept({ resourceType: /xhr|fetch/ }, (req) => {
    req.continue((res) => {
      // Simpan URL dan Response Body ke dalam array
      apiLogs.push({
        url: req.url,
        method: req.method,
        statusCode: res.statusCode,
        responseBody: res.body,
      });
    });
  });
});

afterEach(function () {
  if (this.currentTest.state === "failed") {
    const testTitle = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, "_");
    const errorMessage = this.currentTest.err
      ? this.currentTest.err.message
      : "Unknown error";

    cy.document().then((doc) => {
      const bodyClone = doc.body.cloneNode(true);
      const elementsToRemove = bodyClone.querySelectorAll(
        "script, style, noscript, iframe, link, meta",
      );
      elementsToRemove.forEach((el) => el.remove());

      const svgs = bodyClone.querySelectorAll("svg");
      svgs.forEach((svg) => {
        const placeholder = doc.createElement("span");
        placeholder.textContent = "[ICON_SVG]";
        svg.replaceWith(placeholder);
      });

      const cleanHtml = bodyClone.innerHTML.replace(/\s{2,}/g, " ").trim();

      // INI YANG BARU: Crash report sekarang berisi DOM dan API!
      const crashReport = {
        test_name: this.currentTest.title,
        error_message: errorMessage,
        dom_snapshot: cleanHtml,
        api_history: apiLogs, // Rekam jejak fetch/XHR dimasukkan ke sini
        timestamp: new Date().toISOString(),
      };

      cy.writeFile(
        `cypress/crash-reports/${testTitle}_error.json`,
        crashReport,
      );
    });
  }
});
