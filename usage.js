const renderIt = require('./src/index')

const config = {
  paths: ['/gordon-ramsays-list-of-essential-kitchen-tools'],
  selector: '.contentful__hero-article-title'
}

renderIt('https://masterclass.com/articles', config)
