/**
 * Created by Alvys on 2014-12-14.
 */
var ko = require('knockout');
var ElementSettingModel = require('./elementSettingModel.js');

var PanSettingModel = function (canvasElement) {
  ElementSettingModel.call(this, 'glyphicon-move', canvasElement);
  var self = this;
  self.title = "Enable panning";

  self.tags.push("localDrag");
  self.tagsToDisable.push("localDrag")
  self.tagsToDisable.push("ratioLock")

  var lastDelta = [0, 0];
  var lastPosition = [];

  self.callbacks.drag = function onDragPan(x, y, dX, dY) {
    lastPosition = canvasElement.bgPosition();
    var originalPosition = [lastPosition[0] - lastDelta[0], lastPosition[1] - lastDelta[1]];
    canvasElement.bgPosition([originalPosition[0] + dX, originalPosition[1] + dY])
    lastDelta[0] = dX;
    lastDelta[1] = dY;
  }

  self.callbacks.dragStop = function () {
    lastDelta = [0, 0];
  };
}

PanSettingModel.prototype = Object.create(ElementSettingModel.prototype)
PanSettingModel.prototype.constructor = PanSettingModel;

module.exports = PanSettingModel;