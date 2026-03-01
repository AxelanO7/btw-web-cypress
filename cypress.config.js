const { defineConfig } = require("cypress");
const { execSync } = require("child_process");

const findBrowser = () => {
  // the path is hard-coded for simplicity
  const browserPath =
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser";

  try {
    const stdout = execSync(`"${browserPath}" --version`).toString();
    // STDOUT will be like "Brave Browser 77.0.69.135"
    const match = /Brave Browser (\d+\.\d+\.\d+\.\d+)/.exec(stdout);

    if (match) {
      const version = match[1];
      const majorVersion = parseInt(version.split(".")[0]);

      return {
        name: "brave",
        channel: "stable",
        family: "chromium",
        displayName: "Brave",
        version,
        path: browserPath,
        majorVersion,
      };
    }
  } catch (err) {
    console.error("Failed to find Brave Browser:", err.message);
  }
  return null;
};

module.exports = defineConfig({
  allowCypressEnv: false,
  chromeWebSecurity: false,
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",

  e2e: {
    experimentalStudio: true,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser = {}, launchOptions) => {
        // Hiding the fact that we are using an automated browser
        if (browser.family === "chromium" && browser.name !== "electron") {
          // Removes the "Chrome is being controlled by automated test software" infobar
          launchOptions.args.push("--disable-infobars");
          // Hides navigator.webdriver flag
          launchOptions.args.push(
            "--disable-blink-features=AutomationControlled",
          );
        }
        return launchOptions;
      });

      const braveBrowser = findBrowser();
      if (braveBrowser) {
        config.browsers = config.browsers.concat(braveBrowser);
      }

      return config;
    },
  },
});
