#! /usr/bin/env node

const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const puppeteer = require('puppeteer')
const { JSDOM } = require('jsdom')
const input = require('./input')

const { log } = console

// constants
const OUTPUT_FOLDER_NAME = 'output'
const OUTPUT_FOLDER = path.resolve(process.cwd(), OUTPUT_FOLDER_NAME)
const PATHS = ['/articles/test-article-with-videos/preview']
const DEFAULT_SELECTOR = '#render-it'

const createOutputFolder = () => {
  fs.mkdir(OUTPUT_FOLDER, { recursive: true }, err => {
    if (err) throw err
  })
}

const pageUrl = path => `${process.env.URL}${path}`

const go = async (page, path) => {
  await page.goto(pageUrl(path), { timeout: 0, waitUntil: 'networkidle2' })
}

const getBaseUrl = async () => {
  if (!process.env.URL) {
    const message = chalk.blue('SITE: ')
    const answer = await input(message)
    process.env.URL = answer
  } else {
    log(chalk.blue(`\nSITE: ${process.env.URL}`))
  }
}

const initBrowser = async () => {
  const browser = await puppeteer.launch()
  return browser
}

const saveHTML = (html, pathname) =>
  new Promise((resolve, reject) => {
    // const html = await page.content()
    let file = pathname.substring(1, pathname.length)
    if (!file) {
      file = 'index'
    }
    file = `${file.replace(/\//g, '_')}.html`
    fs.writeFile(path.resolve(OUTPUT_FOLDER, file), html, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

const getElementsToRender = async dom =>
  dom.window.document.querySelectorAll(DEFAULT_SELECTOR)

// const getServerPage = async (browser, path) => {
//   const page = await browser.newPage()
//   await page.setRequestInterception(true)
//   page.on('request', request => {
//     if (pageUrl(path) === request.url() && request.resourceType() === 'document') {
//       request.continue();
//     } else {
//       request.abort();
//     }
//   });
//   page.on('requestfailed', request => {
//     // const url = request.url();
//     // console.log('request failed url:', url);
//   });
//   page.on('response', async response => {
//     if (pageUrl(path) === response.url()) {
//       // const text = await response.text()
//       // console.log(text)
//       // const request = response.request();
//       // const url = request.url();
//       // const status = response.status();
//       // console.log('response url:', url, 'status:', status);
//     }
//   });
//   await go(page, path)
//   // await saveContent(page, path)
//   return page
// }

// const renderClientPage = async (browser, path) => {
//   const page = await browser.newPage()
//   await go(page, path)
//   await page.waitFor(3000)
//   await saveContent(page, path)
// }

const renderPage = async (browser, path) => {
  let serverHTML
  const page = await browser.newPage()
  page.on('response', async response => {
    if (pageUrl(path) === response.url()) {
      serverHTML = await response.text()
    }
  })
  await go(page, path)
  return { page, serverHTML }
}

const replaceNode = (dom, node, index) => {
  const el = dom.window.document.querySelectorAll(DEFAULT_SELECTOR)[index]
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
  log(chalk.grey('Rendering page...'))
  const { page, serverHTML } = await renderPage(browser, path)
  log(chalk.grey('Finding elements to render...'))
  const pageContent = await page.content()
  const serverDom = new JSDOM(serverHTML)
  const clientDom = new JSDOM(pageContent)
  const elements = await getElementsToRender(clientDom)
  if (elements.length > 0) {
    log(chalk.grey('Rendering content...'))
    const HTML = await renderContent(serverDom, elements)
    log(chalk.grey('Saving...'))
    saveHTML(HTML, path)
  } else {
    log(chalk.red('Nothing to render'))
  }
}

// const processPage2 = async (browser, path) => {
//   log(chalk.grey('Rendering server document...'))
//   const serverPage = await getServerPage(browser, path)
//   log(chalk.grey('Finding elements to render...'))
//   const elements = await getElementsToRender(serverPage)
//   console.log(elements)
// }

const renderIt = async () => {
  await getBaseUrl()
  log(chalk.grey('Crawling your site...'))
  createOutputFolder()
  const browser = await initBrowser()
  const promises = PATHS.map(path => processPage(browser, path))
  await Promise.all(promises)
  await browser.close()
  log(chalk.green('Success!'))
}

renderIt()
