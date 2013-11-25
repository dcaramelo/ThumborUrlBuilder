# ThumborUrlBuilder

Thumbor client for Node JS

## Usage 

```javascript 

var ThumborUrlBuilder = require('thumborUrlBuilder'),
	thumborUrlBuilder = new ThumborUrlBuilder("MY_KEY", "http://my.server.com");

var thumborUrl = thumborUrlBuilder.setUrlPath("00223lsvrnzeaf42.png").smart().finalUrl();

```


