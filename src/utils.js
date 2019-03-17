const path = require('path')
const fs = require('fs')

const { getConfig } = require('./config')

const createOutputFolder = (outputFolderPath) =>
  new Promise((resolve) => {
    fs.mkdir(outputFolderPath, { recursive: true }, () => {
      resolve()
    });
  })

module.exports.saveHTML = (html, pathname) =>
  new Promise(async (resolve, reject) => {
    const outputFolderPath = path.resolve(process.cwd(), getConfig().outputFolder)
    await createOutputFolder(outputFolderPath)
    let file = pathname.substring(1, pathname.length)
    if (!file) {
      file = 'index'
    }
    file = file.replace(/\//g, '_') + '.html'
    fs.writeFile(
      path.resolve(outputFolderPath, file),
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

module.exports.compareURLs = (url1, url2) => {
  const plainURL1 = url1.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
  const plainURL2 = url2.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
  return plainURL1 === plainURL2
}
