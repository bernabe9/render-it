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

  const browser = await puppeteer.launch({ headless: config.headless })
  const promises = config.paths.map(path => processPage(browser, path))
  await Promise.all(promises)
  await browser.close()
  if (server) {
    server.close()
  }
  log(chalk.green('Success!'))
}

module.exports = renderIt
