var crypto = require('crypto');

function ThumborUrlBuilder(securityKey, thumborServerUrl) {
	this.THUMBOR_SECURITY_KEY 	= securityKey;
	this.THUMBOR_URL_SERVER 	= thumborServerUrl;

	this.urlPath			= '';
	this.hasResize 			= false;
	this.isSmart 			= false;
	this.resizeWidth 		= 0;
	this.resizeHeight 		= 0;
}

ThumborUrlBuilder.prototype = {

	setUrlPath: function(urlPath) {

		this.urlPath = (urlPath.charAt(0)) == '/' ? urlPath.substring(1,urlPath.lenght) : urlPath;
		return this;
	},

	resize: function(width, height) {
		this.hasResize		= true;
		this.resizeWidth 	= width;
		this.resizeHeight 	= height;
		return this;
	},

	smart: function() {
		this.isSmart = true;
		return this;
	},

	finalUrl: function() {

		var operation = '';

		if (this.hasResize) {
			operation = operation + this.resizeWidth + 'x' + this.resizeHeight + '/';
		}

		if (this.isSmart) {
			operation = operation + 'smart/';
		}

		if (this.THUMBOR_SECURITY_KEY) {

			var key = crypto.createHmac("sha1", this.THUMBOR_SECURITY_KEY).update(operation + this.urlPath).digest("base64");
			key = key.replace(/\+/g, "-").replace(/\//g, "_");

			return this.THUMBOR_URL_SERVER + '/' + key + '/' + operation + this.urlPath;
		} else {
			return this.THUMBOR_URL_SERVER + '/unsafe/' + operation + this.urlPath;
		}
	}
}

module.exports = ThumborUrlBuilder;