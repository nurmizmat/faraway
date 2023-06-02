const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper');
const metamask = require('./cypress/support/metamask');

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1920,
    viewportHeight: 1080,
    video: true,
    chromeWebSecurity: false,
    defaultCommandTimeout: 30000,
    env: {
      baseUrl: 'http://127.0.0.1:8081/',
      walletAddress: '0xaE92aC998572073B53B75eC47EaDDaDb94631ab0',
      secretWords: 'reopen artwork spike inherit hobby trial sudden innocent visit smart stumble frown',
      passwordWallet: '!Password123',
      botID: '6225819799:AAHPiVZ6wiWCCLEna675LtSlcqepUeWGQxM',
      chatID: '-1001918618634',
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
        setupMetamask: async ({ secretWords, password }) => {
          const setup = await metamask.setupMetamask({ secretWords, password });
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
