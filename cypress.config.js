const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const metamask = require('./cypress/support/metamask');
const dotenv = require('dotenv');
dotenv.config();

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 30000,
    env: {
      baseUrl: 'http://127.0.0.1:8081/',
      walletAddress: process.env.WALLET_ADDRESS,
      walletSecret: process.env.WALLET_SECRET,
      walletPassword: process.env.WALLET_PASSWORD,
      botID: process.env.BOT_ID,
      chatID: process.env.CHAT_ID,
    },

    setupNodeEvents(on, config) {
      on('before:browser:launch', async (browser = {}, launchOptions) => {
        const projectDirectory = path.resolve(__dirname);
        const targetDirectory = path.join(projectDirectory, 'cypress/support/downloads');

        if (browser.name === 'chrome') {
          const zipFilePath = path.join(targetDirectory, 'metamask-chrome-10.15.0.zip');
          const unzipPath = path.join(targetDirectory, 'metamask');

          if (!fs.existsSync(unzipPath)) {
            await fs.createReadStream(zipFilePath)
              .pipe(unzipper.Extract({ path: unzipPath }))
              .promise();
          }

          launchOptions.args.push(`--load-extension=${unzipPath}`);
        }
        return launchOptions;
      });

      on('task', {
        setupMetamask: async ({ secret, password }) => {
          const setup = await metamask.setupMetamask({ secret, password });
          return setup;
        },
        addNetwork: async (network) => {
          const networkAdded = await metamask.addNetwork(network);
          return networkAdded;
        },
        connectMetamask: async () => {
          const connected = await metamask.connectMetamask();
          return connected;
        },
        confirmTransaction: async () => {
          const confirmed = await metamask.confirmTransaction();
          return confirmed;
        },
      })
      return config
    }
  }
})
