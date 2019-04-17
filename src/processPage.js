const chalk = require('chalk')
const { JSDOM } = require('jsdom')

const { saveHTML, compareURLs } = require('./utils')
const { getConfig } = require('./config')

const { log } = console

const pageUrl = path => `${getConfig().url}${path}`

const go = async (page, path) => {
  await page.goto(pageUrl(path), { timeout: 0, waitUntil: 'networkidle2' })
}

const getElementsToRender = async dom =>
  dom.window.document.querySelectorAll(getConfig().selector)

const renderPage = async (browser, path) => {
  let serverHTML
  const page = await browser.newPage()
  page.on('response', async response => {
    const headers = response.headers()
    const isHTML = headers['content-type'].includes('text/html')
    if (compareURLs(pageUrl(path), response.url()) && isHTML) {
      serverHTML = await response.text()
    }
  })
  await go(page, path)
  return { page, serverHTML }
}

const replaceNode = (dom, node, index) => {
  const el = dom.window.document.querySelectorAll(getConfig().selector)[index]
  el.parentNode.replaceChild(node, el)
}

const renderContent = async (serverDom, elements) => {
  elements.forEach((element, index) => {
    replaceNode(serverDom, element, index)
  })
  return serverDom.serialize()
}

const processPage = async (browser, path) => {
  log(chalk.blue(`PAGE: ${pageUrl(path)}`))
  log(chalk.grey('Rendering page... 📝'))
  const { page, serverHTML } = await renderPage(browser, path)
  const pageContent = await page.content()
  const serverDom = new JSDOM(serverHTML)
  const clientDom = new JSDOM(pageContent)
  // save original HTML file
  saveHTML(serverDom.serialize(), '/200')
  log(chalk.grey('Finding elements to render...'))
  const elements = await getElementsToRender(clientDom)
  if (elements.length > 0) {
    log(chalk.grey('Rendering content...'))
    const HTML = await renderContent(serverDom, elements)
    if (getConfig().saveOutput) {
      log(chalk.grey('Saving...'))
      saveHTML(HTML, path)
    }
    return { path, HTML }
  }
  log(chalk.red('Nothing to render 🤷‍♂️'))
  return { error: 'Nothing to render' }
}

module.exports = processPage
