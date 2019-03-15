# Render It :pencil:
Crawl and render any JavaScript web app to create static sites ready for SEO

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
| outputPath | output | path of the folder to store the generated static pages |
| paths | ['/'] | url pathnames to render |
| selector | #render-it | selector to render the JavaScript content |
| headless | true | Force to use a non-headless browser to render the content |


## Roadmap

| Feature  | Status |
| ------------- | ------------- |
| CLI  | In progress  |
| Auto crawling  | Pending  |
| Wait to render  | Pending  |
| Auto render  | Pending  |
| Support multiple selectors  | Pending  |
