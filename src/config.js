const defaultConfig = require('./defaultConfig')

let config = {}

module.exports.setConfig = userConfig => {
  config = { ...defaultConfig, ...userConfig }
}

module.exports.getConfig = () => config
