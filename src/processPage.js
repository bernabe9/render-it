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
  log(`${chalk.blue('info:')} 📝 Rendering page ${pageUrl(path)}`)
  const { page, serverHTML } = await renderPage(browser, path)
  const serverDom = new JSDOM(serverHTML)
  if (path === '/200.html') {
    // save original HTML file
    saveHTML(serverDom.serialize(), path)
    return { HTML: serverDom.serialize(), path }
  }
  const pageContent = await page.content()
  const clientDom = new JSDOM(pageContent)
  log(
    `${chalk.blue('info:')} 🔍 Finding elements to render for page ${pageUrl(
      path
    )}`
  )
  const elements = await getElementsToRender(clientDom)
  if (elements.length > 0) {
    log(`${chalk.blue('info:')} ✏️  Rendering content on page ${pageUrl(path)}`)
    const HTML = await renderContent(serverDom, elements)
    if (getConfig().saveOutput) {
      log(`${chalk.blue('info:')} 💾 Saving page ${pageUrl(path)}`)
      saveHTML(HTML, path)
    }
    return { path, HTML }
  }
  log(`${chalk.yellow('warning:')} 🤷‍♂️  Nothing to render on ${pageUrl(path)}`)
  return { error: 'Nothing to render' }
}

module.exports = processPage
