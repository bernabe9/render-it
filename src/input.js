const readline = require('readline')

module.exports = async message =>
  new Promise(resolve => {
    // Config readline
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(message, answer => {
      rl.close()
      resolve(answer)
    })
  })
