#! /usr/bin/env node

const chalk = require('chalk')
const path = require('path')
const fs = require('fs')
const puppeteer = require('puppeteer')
const input = require('./input')

const { log } = console

// constants
const OUTPUT_FOLDER_NAME = 'output'
const OUTPUT_FOLDER = path.resolve(process.cwd(), OUTPUT_FOLDER_NAME)
const PATHS = [
  '/articles/test-article-with-videos/preview',
]

const createOutputFolder = () => {
  fs.mkdir(OUTPUT_FOLDER, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

const go = async (page, path) => {
  const url = process.env.URL
  await page.goto(`${url}${path}`, { timeout: 0, waitUntil: 'networkidle2' })
}

const getBaseUrl = async () => {
  if (!process.env.URL) {
    const message = chalk.blue('URL: ')
    const answer = await input(message)
    process.env.URL = answer
  } else {
    log(chalk.blue(`\nURL = ${process.env.URL}`))
  }
}

const initBrowser = async () => {
  const browser = await puppeteer.launch()
  return browser
}

const saveHTML = (html, pathname) =>
  new Promise((resolve, reject) => {
    let file = pathname.substring(1, pathname.length)
    if (!file) {
      file = 'index'
    }
    file = file.replace(/\//g, '_') + '.html'
    fs.writeFile(
      path.resolve(OUTPUT_FOLDER, file),
      html,
      (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      }
    )
  })


const renderPage = async (browser, path) => {
  const page = await browser.newPage()
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = request.url();
    request.continue();
  });
  page.on('requestfailed', request => {
    const url = request.url();
    console.log('request failed url:', url);
  });
  page.on('response', response => {
    const request = response.request();
    const url = request.url();
    const status = response.status();
    console.log('response url:', url, 'status:', status);
  });
  await go(page, path)
  await page.waitFor(3000)
  const html = await page.content()
  await saveHTML(html, path)
}

const renderIt = async () => {
  await getBaseUrl()
  log(chalk.grey('Crawling your site...'))
  createOutputFolder()
  const browser = await initBrowser()
  const promises = PATHS.map(path => renderPage(browser, path))
  await Promise.all(promises)
  await browser.close()
  log(chalk.green('Success!'))
}

renderIt()
