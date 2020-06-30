# ThumborUrlBuilder

Thumbor client for Node JS

## Usage

```sh
# Install thumbor-url-builder module

npm install thumbor-url-builder --save
```

HashFn returns the string hashed and base64url encoded. Depending on the library you are using, you might need to encode to base64 then replace `+` and `/` chars. For NodeJS, it might be supported in the future : https://github.com/nodejs/node/issues/26512

```javascript
// Declare thumbor-url-builder in JS
// Your encryption key is not required, but your link will be unsafe.

// Browser & NodeJS compatible
var crypto = require('crypto-js');
var hashFn = function (stringToHash, secret) {
    var key = crypto.HmacSHA1(operation + this.imagePath, this.THUMBOR_SECURITY_KEY);
    var hash = crypto.enc.Base64.stringify(key);
    return hash.replace(/\+/g, '-').replace(/\//g, '_');
}

// NodeJS compatible (faster hash)
var crypto = require('crypto');
var hashFn = function (stringToHash, secret) {
    var hmac = crypto.createHmac('sha1', secret);
    hmac.update(operation + this.imagePath);
    var hash = hmac.digest('base64');
    return hash.replace(/\+/g, '-').replace(/\//g, '_');
}

var ThumborUrlBuilder = require('thumbor-url-builder');
var thumborURL = new ThumborUrlBuilder('http://myserver.thumbor.com', 'MY_KEY', hashFn);

// Generate your url :

var thumborUrl = thumborURL.setImagePath('00223lsvrnzeaf42.png').resize(50, 50).smartCrop(true).buildUrl();
```
