var crypto = require('crypto');
function ThumborUrlBuilder(securityKey, thumborServerUrl) {
  'use strict'

  this.THUMBOR_SECURITY_KEY = securityKey;
  this.THUMBOR_URL_SERVER   = thumborServerUrl;

  this.urlPath              = '';
  this.hasResize            = false;
  this.isSmart              = false;
  this.resizeWidth          = 0;
  this.resizeHeight         = 0;
}

ThumborUrlBuilder.prototype = {

  setUrlPath: function(urlPath) {

    this.urlPath = (urlPath.charAt(0)) == '/' ? urlPath.substring(1,urlPath.lenght) : urlPath;
    return this;
  },

  requestPath: function() {
      var parts = this.urlParts();
      return parts.join('/');
  },

  urlParts: function() {
    if (!this.urlPath) {
      throw Error('The image url can\'t be null or empty.');
    }

    var parts = [];

    if (this.meta) {
        parts.push('meta');
    }

    if (this.cropValues) {
        parts.push(this.cropValues.left + 'x' + this.cropValues.top + ':' + this.cropValues.right + 'x' + this.cropValues.bottom);
    }

    if (this.width || this.height || this.withFlipHorizontally || this.withFlipVertically) {
      var sizeString = '';

      if (this.withFlipHorizontally) {
        sizeString += '-';
      }
      sizeString += this.width;

      sizeString += 'x';

      if (this.withFlipVertically) {
        sizeString += "-";
      }
      sizeString += this.height;

      parts.push(sizeString);
    }

    return parts;
  },

  resize: function(width, height) {
    this.width = width;
    this.height = height;
    return this;
  },

  smart: function() {
    this.smart = true;
    return this;
  },

  fitIn: function(width, height) {
    this.width = width;
    this.height = height;
    this.fitInFlag = true;
    return this;
  },

  flipHorizontally: function() {
    this.withFlipHorizontally = true;
    return this;
  },

  flipVertically: function() {
    this.withFlipVertically = true;
    return this;
  },

  halign: function(halign) {
      if (halign === this.LEFT || halign === this.RIGHT || halign === this.CENTER) {
          this.halignValue = halign;
      } else {
          throw Error('Horizontal align must be left, right or center.');
      }
      return this;
  },

  valign: function(valign) {
      if (valign === this.TOP || valign === this.BOTTOM || valign === this.MIDDLE) {
          this.valignValue = valign;
      } else {
          throw Error('Vertical align must be top, bottom or middle.');
      }
      return this;
  },

  metaDataOnly: function() {
      this.meta = true;
      return this;
  },

  filter: function(filterCall) {
    this.filtersCalls.push(filterCall);
    return this;
  },

  crop: function(left, top, right, bottom) {
    if (left > 0 && top > 0 && right > 0 && bottom > 0) {
      this.cropValues = {left: left, top: top, right: right, bottom: bottom};
    }
    return this;
  },

  buildUrl: function() {

    var operation = '';

    operation = this.requestPath() + '/';


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