/**
 * Created by Alvys on 2014-12-13.
 */

var ko = require('knockout');
var $ = require('jquery');

var CanvasElementModel = require('./canvasElementModel');

var ScaleSettingModel = require('./settings/scaleSettingModel.js');
var PanSettingModel = require('./settings/panSettingModel.js');
var RatioLockSettingModel = require('./settings/ratioLockSettingModel.js');
var BoundsModel = require('./boundsModel.js');

var ImageModel = function (image, bounds) {
  CanvasElementModel.call(this, bounds);
  var self = this;

  // Properties
  self.elementType = 'image';
  self.imageUrl = image.src;
  self.scale = ko.observable(100);
  self.bgPosition = ko.observable([0,0]);

  self.isImageBound = ko.observable(true);
  self.imageElement = image;
  self.bgSizeCssValue = ko.observable('initial');

  // Adding the settings
  self.panSettings = new PanSettingModel(self);
  self.ratioLockSettings = new RatioLockSettingModel(self);
  self.settings.push(this.panSettings);
  self.settings.push(this.ratioLockSettings);

};

ImageModel.prototype = Object.create(CanvasElementModel.prototype);
ImageModel.prototype.constructor = ImageModel;

ImageModel.prototype.onDomInitialized = function () {
  //this.changeScalePercentage(100);
};

ImageModel.prototype.lockRatioWithin = function (width, height) {
  console.log("Locking ratio");
  var imageWidth = this.imageElement.width;
  var imageHeight = this.imageElement.height;

  // Check if the image is wide
  var wide = imageWidth/imageHeight >= 1;

  // Calculating a new scale for the image
  var scale = wide? width/imageWidth : height/imageHeight;

  // Making sure image fits withing new bounds with new scale
  if (wide) {
    if (imageHeight * scale > height) {
      // Image is too tall, scale by height
      scale = height/imageHeight;
    }
  } else {
    if (imageWidth * scale > width) {
      // Image is too wide, scale by width
      scale = width/imageWidth;
    }
  }

  this.changeScale(scale*100);
  this.bounds.lockRatio(imageWidth/imageHeight);
  this.bounds.setSize(Math.round(imageWidth * scale), Math.round(imageHeight * scale));
};

ImageModel.prototype.toJSON = function () {
  return {
    elementType: this.elementType,
    bounds: this.bounds.toJSON(),
    imageUrl : this.imageUrl,
    scale : this.scale(),
    bgPosition: this.bgPosition()
  };
};

ImageModel.fromJSON = function (data, callback) {
  var image = new Image();
  image.src = data.imageUrl;

  $(image).load(function () {
    var imageModel = new ImageModel(image,
        BoundsModel.fromJSON(data.bounds));
    imageModel.changeScale(data.scale);
    imageModel.bgPosition(data.bgPosition);
    callback(imageModel);
  });
};

ImageModel.fromUrl = function (url, callback, failedCallback) {
// Getting image information
  var image = new Image();
  image.src = url;
  console.log("iki cia");
  $(image).load(function () {
    console.log("PRAEJO");
    callback(new ImageModel(image,
        new BoundsModel(324, 67, 387, 307)
    ));
  });
};

ImageModel.prototype.onMouseWheel = function(event) {
  this.scaleFromElementPoint(this.lastMousePosition, this.scale() + event.deltaY*10);
};

ImageModel.prototype.scaleFromElementPoint = function (point, newScale) {
  var bgPos = this.bgPosition();
  var curScale = this.scale();

  var imageWidth = this.imageElement.width;
  var imageHeight = this.imageElement.height;

  // Get position of the unscaled image
  var imageX = (point[0]- bgPos[0]) /(curScale/100);
  var imageY = (point[1]- bgPos[1]) /(curScale/100);

  // Calculate where position is (percentage)
  var imageXRatio = imageX/imageWidth;
  var imageYRatio = imageY/imageHeight;

  // Calculate a new size for the image
  var newWidth = this.imageElement.width * newScale/100;
  var newHeight = this.imageElement.height * newScale/100;

  // Calculate a position of the pointer on the "scaled" image
  var newImageX = (newWidth*imageXRatio);
  var newImageY = (newHeight*imageYRatio);

  // Apply the changes
  this.bgPosition([
    bgPos[0] - (newImageX - (imageX* (curScale/100)))  ,
    bgPos[1] - (newImageY - (imageY* (curScale/100)))
  ]);
  this.changeScale(newScale);

};

ImageModel.prototype.onDrag = function (x, y, dX, dY, e) {
  var capturedBySettings = this.resolveDragSettings(x, y, dX, dY, e);

  if (!capturedBySettings) {
    if (e.ctrlKey) {
      this.panSettings.callbacks.drag(x, y, dX, dY);
    } else {
      this.setPosition(x, y);
    }
  }
};

ImageModel.prototype.changeScale = function (scale) {
  this.scale(scale);
  this.changeScaleCss(this.imageElement.width * (scale/100), this.imageElement.height * (scale/100));
};

ImageModel.prototype.changeScaleCss = function (width, height) {
  this.bgSizeCssValue(Math.round(Math.abs(width, 10)) + "px "  + Math.round(Math.abs(height, 10)) + "px ")
}

ImageModel.prototype.onBoundsChange = function () {
  if (this.bounds.keepRatio()) {
    var newScale = this.bounds.width() / this.imageElement.width;
    this.scaleFromElementPoint([0,0], newScale * 100);
  }
};

module.exports = ImageModel;
