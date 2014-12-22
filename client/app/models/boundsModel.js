/**
 * Created by Alvys on 2014-12-13.
 */

var ko = require('knockout');

var MIN_BOUNDS = 20;

var BoundsModel = function BoundsModel(x, y, width, height) {
  var self = this;

  self.controller = new PointModel(width, height);

  self.ratio = ko.observable(true);
  self.keepRatio = ko.observable(true);

  self.changeListeners = [];

  self.x = ko.observable(x);
  self.y = ko.observable(y);

  self.width = ko.computed(function () {
    return self.controller.x();
  });
  self.height = ko.computed(function () {
    return self.controller.y();
  });


};

BoundsModel.prototype.lockRatio = function (ratio) {
  this.ratio(ratio);
  this.keepRatio(true);
};

BoundsModel.prototype.unlockRatio = function () {
  this.keepRatio(false);
};

BoundsModel.prototype.coversPosition = function (x, y) {
  return (this.x() <= x && this.x() + this.width() >= x)
      && (this.y() <= y && this.y() + this.height() >= y);
};

BoundsModel.prototype.addChangeListener = function (callback) {
  this.changeListeners.push(callback);
};

BoundsModel.prototype.setSize = function (width, height) {
  if (this.keepRatio()) {
    height = width / this.ratio();
  }
  this.controller.x(width);
  this.controller.y(height);
  this.changeListeners.forEach(function boundsChangeTrigger (listener) {
    listener();
  });
};

BoundsModel.prototype.update = function (controllerX, controllerY) {
  this.setSize(controllerX > MIN_BOUNDS ? controllerX : MIN_BOUNDS,
      controllerY > MIN_BOUNDS ? controllerY : MIN_BOUNDS);
};

var PointModel = function PointModel(x, y) {
  var self = this;
  self.x = ko.observable(x);
  self.y = ko.observable(y);
}

module.exports = BoundsModel;