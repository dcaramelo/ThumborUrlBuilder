# ThumborUrlBuilder

Thumbor client for Node JS

## Usage

```sh
# Install thumbor-url-builder module

npm install thumbor-url-builder --save
```

```javascript
// Declare thumbor-url-builder in JS
// Your encryption key is not required, but your link will be unsafe.

var ThumborUrlBuilder = require('thumbor-url-builder');
var thumborURL = new ThumborUrlBuilder('http://myserver.thumbor.com', 'MY_KEY');

// Generate your url :

var thumborUrl = thumborURL.setImagePath('00223lsvrnzeaf42.png').resize(50, 50).smartCrop(true).buildUrl();
```
