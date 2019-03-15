const chalk = require('chalk')
const puppeteer = require('puppeteer')

const processPage = require('./processPage')
const { setConfig, getConfig } = require('./config')

const { log } = console

const renderIt = async (url, userConfig) => {
  if (!url) {
    log(chalk.red('ERROR: You must enter a URL to crawl'))
    return
  }

  setConfig({ ...userConfig, url })

  const config = getConfig()
  const browser = await puppeteer.launch({ headless: config.headless })
  const promises = config.paths.map(path => processPage(browser, path))
  await Promise.all(promises)
  await browser.close()
  log(chalk.green('Success!'))
}

module.exports = renderIt
