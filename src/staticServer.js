const express = require('express')
const path = require('path')
const chalk = require('chalk')

const { getConfig } = require('./config')

module.exports = () =>
  new Promise((resolve, reject) => {
    const app = express()
    const port = 9000
    const config = getConfig()

    app.use(express.static(path.join(process.cwd(), config.outputFolder)))

    app.get('*', (req, res) => {
      res.sendFile(path.join(process.cwd(), config.outputFolder, 'index.html'))
    })

    const server = app.listen(port, err => {
      if (err) {
        reject(err)
      } else {
        console.log(chalk.blue(`==> 🌎 Server listening on port ${port}\n`))
        resolve({ server, port })
      }
    })
  })
