const defaultConfig = require('./defaultConfig')

let config = {}

module.exports.setConfig = userConfig => {
  config = {
    ...defaultConfig,
    ...userConfig,
    puppeteerConfig: {
      ...defaultConfig.puppeteerConfig,
      ...(userConfig.puppeteerConfig && { ...userConfig.puppeteerConfig })
    }
  }
}

module.exports.getConfig = () => config
