const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')

const { getConfig } = require('./config')

const createFolder = folder =>
  new Promise((resolve, reject) => {
    mkdirp(folder, error => (error ? reject(error) : resolve()))
  })

module.exports.saveHTML = (html, pathname) =>
  new Promise(async (resolve, reject) => {
    const outputFolderPath = path.resolve(
      process.cwd(),
      getConfig().outputFolder
    )
    const { dir, ext, name } = path.parse(pathname.replace(/\//g, path.sep))
    let folder
    let fileName
    if (ext === '.html') {
      folder = path.join(outputFolderPath, dir)
      fileName = name
    } else {
      folder = path.join(outputFolderPath, pathname)
      fileName = 'index'
    }
    await createFolder(folder)
    const file = `${fileName}.html`
    fs.writeFile(path.resolve(folder, file), html, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })

module.exports.compareURLs = (url1, url2) => {
  const plainURL1 = url1.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
  const plainURL2 = url2.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '')
  return plainURL1 === plainURL2
}
