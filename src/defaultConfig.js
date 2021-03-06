const { DEFAULT_OUTPUT_FOLDER, DEFAULT_SELECTOR } = require('./constants')

module.exports = {
  outputFolder: DEFAULT_OUTPUT_FOLDER,
  paths: ['/'],
  selector: DEFAULT_SELECTOR,
  puppeteerConfig: {
    headless: true
  },
  saveOutput: true
}
