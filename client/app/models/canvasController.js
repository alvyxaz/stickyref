/**
 * Created by Alvys on 2014-12-21.
 */

var ImageModel = require('./imageModel.js');
var BoundsModel = require('./boundsModel.js');

var CanvasController = function (canvas) {
  var self = this;
  self.canvas = canvas;

  //this.addImage('http://th04.deviantart.net/fs70/PRE/f/2014/344/2/0/2045e167cc8772ef6c7ab9731534a200-d89dozu.jpg');
};

CanvasController.prototype.addImage = function (url) {
  this.canvas.addImage(new ImageModel(url,
      new BoundsModel(324, 67, 387, 307)
  ));
};

CanvasController.prototype.openNewImageModal = function () {
  console.log("Opening");
}

module.exports = CanvasController;