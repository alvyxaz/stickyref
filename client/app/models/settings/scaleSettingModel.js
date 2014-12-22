/**
 * Created by Alvys on 2014-12-14.
 */
var ko = require('knockout');
var ElementSettingModel = require('./elementSettingModel.js');

var ScaleSettingModel = function (canvasElement) {
  ElementSettingModel.call(this, 'glyphicon-resize-full', canvasElement);
  var self = this;

  self.tags.push("localDrag");
  self.tagsToDisable.push("localDrag")

  var lastScale = 0;
  var lastDelta = 0;

  self.callbacks.drag = function onDragPan(x, y, dX) {
    lastScale = canvasElement.scale();
    var originalScale = lastScale - lastDelta;
    canvasElement.scale(originalScale + dX);
    //canvasElement.changeScalePercentage(canvasElement.scale());
    lastDelta = dX;
  }

  self.callbacks.dragStop = function () {
    lastDelta = 0;
  };
}

ScaleSettingModel.prototype = Object.create(ElementSettingModel.prototype)
ScaleSettingModel.prototype.constructor = ScaleSettingModel;

module.exports = ScaleSettingModel;