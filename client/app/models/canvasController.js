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
    self.canvas.app.notificationController.addSuccess("Image added successfully");
  }, function () {
    self.resolveDAImageUrl(url);
    self.canvas.app.notificationController.addNormal("Not an image url... Trying it as DA link");
  });

};

CanvasController.prototype.resolveDAImageUrl = function (url, callback, failedCallback) {
  var self = this;
  $.ajax({
    type: "POST",
    url: 'http://stickyref.com/server/curl.php',
    data: {'url' : url}
  }).done(function (data) {
    var images = $(data).find('.dev-view-deviation img');
    if (images.length > 0) {
      var imageUrl = images.get(0).src;
      self.canvas.app.notificationController.addNormal("Image found on DeviantArt. Doing magic stuff...");
      self.addImage(imageUrl);
    } else {
      self.canvas.app.notificationController.addError("Invalid url.");
    }
  }).fail(function () {
    self.canvas.app.notificationController.addError("Invalid url.");
  });
};

CanvasController.prototype.openImageResolver = function () {
  console.log(this.canvas);
  this.canvas.app.imageResolver.open();
}

module.exports = CanvasController;