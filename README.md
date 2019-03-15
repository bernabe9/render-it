# Render It :pencil:
Crawl and render any javascript web app to create static sites ready for SEO

## Motivation

If you are here, you probably have a problem like this:

Your server is returning a HTML struture without the content that JavaScript is rendering.

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

**Render It** allows you to generate all the static pages WITH the content. It returns the same HTML structure from the server but with the javascript content inside the placeholder.
