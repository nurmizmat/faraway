const { confirmTransactionPageElements } = require('./pages/metamask/confirmation-page');
const { mainPageElements } = require('./pages/metamask/main-page');
const { pageElements } = require('./pages/metamask/page');
const { permissionsPageElements } = require('./pages/metamask/connect-page');
const { unlockPageElements } = require('./pages/metamask/unlock-page');
const {
  endOfFlowPageElements,
  importWithSeedPhrasePageElements,
  metametricsOptInPageElements,
  selectActionPageElements,
  welcomePageElements
} = require('./pages/metamask/initialize-page');
const {
  addNetworkPageElements,
  loadingModalElements,
  networksPageElements,
  settingsPageElements
} = require('./pages/metamask/settings-page');

const puppeteer = require('./puppeteer');

module.exports = {
  fixBlankPage: async () => {
    await puppeteer.metamaskWindow().waitForTimeout(1000)
    for (let times = 0; times < 5; times++) {
      if ((await puppeteer.metamaskWindow().$(mainPageElements.app)) === null) {
        await puppeteer.metamaskWindow().reload()
        await puppeteer.metamaskWindow().waitForTimeout(1000)
      } else {
        break
      }
    }
  },
  reloadPage: async (selector) => {
    await puppeteer.metamaskWindow().reload()
    await puppeteer.metamaskWindow().waitForTimeout(1000)
    for (let times = 0; times < 5; times++) {
      if ((await puppeteer.metamaskWindow().$(selector)) === null) {
        await puppeteer.metamaskWindow().reload()
        await puppeteer.metamaskWindow().waitForTimeout(10000)
      } else {
        break
      }
    }
  },
  confirmWelcomePage: async () => {
    await module.exports.fixBlankPage()
    await puppeteer.waitAndClick(welcomePageElements.getStartedButton)
    return true
  },
  closePopup: async () => {
    if (
      (await puppeteer.metamaskWindow().$(mainPageElements.popup.container)) !==
      null
    ) {
      await puppeteer.waitAndClick(mainPageElements.popup.closeButton)
    }
    return true
  },
  unlock: async (password) => {
    await module.exports.fixBlankPage()
    await puppeteer.waitAndType(unlockPageElements.passwordInput, password)
    await puppeteer.waitAndClick(unlockPageElements.unlockButton)
    await puppeteer.waitFor(mainPageElements.app)
    await module.exports.closePopup()
    return true
  },
  importWallet: async (secret, password) => {
    const secretArray = secret.split(' ')
    await puppeteer.waitAndClick(selectActionPageElements.importWalletButton)
    await puppeteer.waitAndClick(metametricsOptInPageElements.noThanksButton)
    // type secret words
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord0,
      secretArray[0]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord1,
      secretArray[1]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord2,
      secretArray[2]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord3,
      secretArray[3]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord4,
      secretArray[4]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord5,
      secretArray[5]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord6,
      secretArray[6]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord7,
      secretArray[7]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord8,
      secretArray[8]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord9,
      secretArray[9]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord10,
      secretArray[10]
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.secretWord11,
      secretArray[11]
    )
    // type password
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.newPasswordInput,
      password
    )
    await puppeteer.waitAndType(
      importWithSeedPhrasePageElements.confirmPasswordInput,
      password
    )
    // accept terms
    await puppeteer.waitAndClick(importWithSeedPhrasePageElements.termsCheckbox)
    // click import
    await puppeteer.waitAndClick(importWithSeedPhrasePageElements.importButton)
    // click all done
    await puppeteer.waitAndClick(endOfFlowPageElements.allDoneButton)
    await puppeteer.waitFor(mainPageElements.app)
    // close popup
    await module.exports.closePopup()
    return true
  },
  setupMetamask: async ({ secret, password }) => {
    await puppeteer.init()
    await puppeteer.switchToMetamaskWindow()
    await puppeteer.metamaskWindow().waitForTimeout(1000)
    if (
      (await puppeteer.metamaskWindow().$(unlockPageElements.unlockPage)) ===
      null
    ) {
      await module.exports.confirmWelcomePage()
      await module.exports.importWallet(secret, password)
      await puppeteer.switchToCypressWindow()
      return true
    }
    await module.exports.unlock(password)
    await puppeteer.switchToCypressWindow()
    return true
  },
  addNetwork: async (network) => {
    await puppeteer.switchToMetamaskWindow()
    await puppeteer.waitAndClick(mainPageElements.accountMenu.button)
    await puppeteer.waitAndClick(mainPageElements.accountMenu.settingsButton)
    await puppeteer.waitAndClick(settingsPageElements.networksButton)
    await puppeteer.waitAndClick(networksPageElements.addNetworkButton)
    // type network settings
    if (network.blockExplorer) {
      await puppeteer.waitAndType(
        addNetworkPageElements.blockExplorerInput,
        network.blockExplorer
      )
    }
    if (network.symbol) {
      await puppeteer.waitAndType(
        addNetworkPageElements.symbolInput,
        network.symbol
      )
    }
    await puppeteer.waitAndType(
      addNetworkPageElements.chainIdInput,
      network.chainId
    )
    await puppeteer.waitAndType(
      addNetworkPageElements.rpcUrlInput,
      network.rpcUrl
    )
    await puppeteer.waitAndType(
      addNetworkPageElements.networkNameInput,
      network.networkName
    )
    await puppeteer.waitAndClick(addNetworkPageElements.saveButton)
    await puppeteer.waitForText(
      mainPageElements.networkSwitcher.networkName,
      network.networkName
    )
    await puppeteer.waitForNotExist(pageElements.loadingSpinner)
    await puppeteer.waitForNotExist(loadingModalElements.loadingModal)
    await puppeteer.waitForText(
      mainPageElements.walletInfo.networkName,
      network.symbol
    )
    await puppeteer.switchToCypressWindow()
    return true
  },
  connectMetamask: async () => {
    await puppeteer.switchToMetamaskWindow()
    await module.exports.reloadPage(permissionsPageElements.permissionsPage)
    await puppeteer.waitAndClick(permissionsPageElements.nextButton)
    await puppeteer.waitAndClick(permissionsPageElements.connectButton)
    await puppeteer.metamaskWindow().waitForTimeout(3000)
    await puppeteer.switchToCypressWindow()
    return true
  },
  confirmTransaction: async () => {
    await puppeteer.switchToMetamaskWindow()
    await module.exports.reloadPage(
      confirmTransactionPageElements.confirmTransactionPage
    )
    await puppeteer.waitForEnabled(confirmTransactionPageElements.confirmButton)
    await puppeteer.waitAndClick(confirmTransactionPageElements.confirmButton)
    await puppeteer.switchToCypressWindow()
    return true
  },
}
