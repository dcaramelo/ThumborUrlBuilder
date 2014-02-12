var crypto = require('crypto');

function ThumborUrlBuilder(securityKey, thumborServerUrl) {
  'use strict';

  this.THUMBOR_SECURITY_KEY = securityKey;
  this.THUMBOR_URL_SERVER = thumborServerUrl;

  this.imagePath = '';
  this.width = 0;
  this.height = 0;
  this.smart = false;
  this.fitInFlag = false;
  this.withFlipHorizontally = false;
  this.withFlipVertically = false;
  this.halignValue = null;
  this.valignValue = null;
  this.cropValues = null;
  this.meta = false;
  this.filtersCalls = [];
}

ThumborUrlBuilder.prototype = {

  TOP: 'top',
  MIDDLE: 'middle',
  BOTTOM: 'bottom',

  RIGHT: 'right',
  CENTER: 'center',
  LEFT: 'left',

  setImagePath: function(imagePath) {
    this.imagePath = (imagePath.charAt(0) === '/') ?
      imagePath.substring(1, imagePath.length) : imagePath;
    return this;
  },

  getOperationPath: function() {
    var parts = this.urlParts();

    if (0 === parts.length) {
      return '';
    }

    return parts.join('/') + '/';
  },

  urlParts: function() {
    if (!this.imagePath) {
      throw new Error('The image url can\'t be null or empty.');
    }

    var parts = [];

    if (this.meta) {
      parts.push('meta');
    }

    if (this.cropValues) {
      parts.push(
        this.cropValues.left +
        'x' + this.cropValues.top +
        ':' + this.cropValues.right +
        'x' + this.cropValues.bottom
      );
    }

    if (this.fitInFlag) {
      parts.push('fit-in');
    }


    if (
      this.width ||
      this.height ||
      this.withFlipHorizontally ||
      this.withFlipVertically
    ) {
      var sizeString = '';

      if (this.withFlipHorizontally) {
        sizeString += '-';
      }
      sizeString += this.width;

      sizeString += 'x';

      if (this.withFlipVertically) {
        sizeString += '-';
      }
      sizeString += this.height;

      parts.push(sizeString);
    }

    if (this.halignValue) {
      parts.push(this.halignValue);
    }

    if (this.valignValue) {
      parts.push(this.valignValue);
    }

    if (this.smart) {
      parts.push('smart');
    }

    if (this.filtersCalls.length) {
      parts.push('filters:' + this.filtersCalls.join(':'));
    }

    return parts;
  },

  resize: function(width, height) {
    this.width = width;
    this.height = height;
    return this;
  },

  smartCrop: function(bool) {
    this.smart = bool;
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
    console.log('halign: ', halign);
    if (
      halign === this.LEFT ||
      halign === this.RIGHT ||
      halign === this.CENTER
    ) {
      this.halignValue = halign;
    } else {
      throw new Error('Horizontal align must be left, right or center.');
    }
    return this;
  },

  valign: function(valign) {
    if (
      valign === this.TOP ||
      valign === this.BOTTOM ||
      valign === this.MIDDLE
    ) {
      this.valignValue = valign;
    } else {
      throw new Error('Vertical align must be top, bottom or middle.');
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
      this.cropValues = {
        left: left,
        top: top,
        right: right,
        bottom: bottom
      };
    }
    return this;
  },

  buildUrl: function() {

    var operation = this.getOperationPath();


    if (this.THUMBOR_SECURITY_KEY) {

      var key = crypto
        .createHmac('sha1', this.THUMBOR_SECURITY_KEY)
        .update(operation + this.imagePath)
        .digest('base64');

      key = key.replace(/\+/g, '-').replace(/\//g, '_');

      return this.THUMBOR_URL_SERVER +
        '/' + key +
        '/' + operation +
        this.imagePath;

    } else {
      return this.THUMBOR_URL_SERVER + '/unsafe/' + operation + this.imagePath;
    }
  }
};

module.exports = ThumborUrlBuilder;