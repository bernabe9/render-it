# Render It :pencil:
[![NPM version](https://img.shields.io/npm/v/render-it.svg?style=flat)](https://npmjs.org/package/render-it)

Render any JavaScript content to create static sites ready for SEO.

```bash
$ yarn add --dev render-it
```
or
```bash
$ npm install --save-dev render-it
```

## Motivation

If you are here, you probably have a problem like this:

Your server is returning a HTML struture without the content that JavaScript renders.

```html
<!-- DOCUMENT HTML -->
<!DOCTYPE html>
<html>
  <body>
    <div>Content from the server</div>
    
    <div id='root'></div> <!-- placeholder for JavaScript to render content -->
  </body>
</html>
```

But you want to return the document HTML with the content (usually for SEO).

```html
<!-- DOCUMENT HTML -->
<!DOCTYPE html>
<html>
  <body>
    <div>Content from the server</div>
    
    <div id='root'>Content from the client</div>
  </body>
</html>
```

**Render It** allows you to generate all the static pages WITH the content. It returns the same HTML structure from the server but with the JavaScript content inside the placeholder.

## Why is it awesome?
- Zero config required in the server side.
- Zero config required in the client side.
- Works with any server language.
- Works with any JavaScript library or framework.
- Render just what you need.
- Does not depend on Webpack

Just create a task to generate the static pages!

## Usage
```javascript
import renderIt from 'render-it' // or const renderIt = require('render-it')

const config = {
  paths: ['/about', '/contact']
  selector: '#root',
  outputPath: 'dist'
}

renderIt('http://my-site.com', config) 
```

### Conguration

| Option  | Default | Description |
| ------------- | ------------- | ------------- |
| outputPath | output | Path of the folder to store the generated static pages |
| paths | ['/'] | Url pathnames to render |
| selector | #render-it | Selector to render the JavaScript content |
| headless | true | Force to use a non-headless browser to render the content |


## Roadmap

| Feature  | Status |
| ------------- | ------------- |
| CLI  | In progress  |
| Render meta tags  | Pending  |
| Auto crawling  | Pending  |
| Wait to render  | Pending  |
| Auto render  | Pending  |
| Support multiple selectors  | Pending  |
