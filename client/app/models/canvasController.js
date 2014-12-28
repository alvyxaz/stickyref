/**
 * Created by Alvys on 2014-12-21.
 */

var $ = require('jquery');

var ImageModel = require('./imageModel.js');
var BoundsModel = require('./boundsModel.js');

var CanvasController = function (canvas) {
  var self = this;
  self.canvas = canvas;

  //this.addImage('http://th04.deviantart.net/fs70/PRE/f/2014/344/2/0/2045e167cc8772ef6c7ab9731534a200-d89dozu.jpg');
};

CanvasController.prototype.addImage = function (url) {
  var self = this;

  ImageModel.fromUrl(url, function (image) {
    self.canvas.addImage(image);
    image.lockRatioWithin(300, 300);
  });

};

CanvasController.prototype.openImageResolver = function () {
  console.log(this.canvas);
  this.canvas.app.imageResolver.open();
}

module.exports = CanvasController;