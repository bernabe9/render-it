const chalk = require('chalk')
const puppeteer = require('puppeteer')

const processPage = require('./processPage')
const staticServer = require('./staticServer')
const { setConfig, getConfig } = require('./config')

const { log } = console

const renderIt = async (userConfig) => {
  setConfig({ ...userConfig })
  const config = getConfig()
  let server

  if (!userConfig.url) {
    log(chalk.blue(`Running a static server in /${config.outputFolder}`))
    try {
      const staticServerData = await staticServer()
      server = staticServerData.server
      const { port } = staticServerData

      setConfig({ ...config, url: `http://localhost:${port}` })
    } catch (err) {
      log(chalk.red(`Failed to start server: ${err}`))
    }
  }

  let browser
  if (config.browser) {
    browser = config.browser
  } else {
    browser = await puppeteer.launch({ headless: config.headless })
  }
  const promises = config.paths.map(path => processPage(browser, path))
  const result = await Promise.all(promises)
  if (!config.browser) {
    await browser.close()
  }
  if (server) {
    server.close()
  }
  log(chalk.green('Success!'))
  return result
}

module.exports = renderIt
