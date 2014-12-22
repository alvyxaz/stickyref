/**
 * Created by Alvys on 2014-12-14.
 */
var ko = require('knockout');
var ElementSettingModel = require('./elementSettingModel.js');

var RatioLockSettingModel = function (canvasElement) {
  ElementSettingModel.call(this, 'glyphicon-lock', canvasElement);
  var self = this;

  self.isActive = ko.computed(function () {
    return canvasElement.bounds.keepRatio();
  });

}

RatioLockSettingModel.prototype = Object.create(ElementSettingModel.prototype)
RatioLockSettingModel.prototype.constructor = RatioLockSettingModel;

RatioLockSettingModel.prototype.onClick = function () {
  if (this.isActive()) {
    // Deactivate
    this.canvasElement.bounds.keepRatio(false);
  } else {
    var bounds = this.canvasElement.bounds;
    this.canvasElement.lockRatioWithin(bounds.width(), bounds.height());
  }
};

module.exports = RatioLockSettingModel;