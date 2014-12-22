/**
 * Created by Alvys on 2014-12-13.
 */

var ko = require('knockout');
var _ = require('lodash');

var CanvasElementModel = function CanvasElementModel(bounds) {
  var self = this;
  self._canvas = undefined;
  self.domElement = undefined;
  self.z = ko.observable(0);
  self.elementType = 'element';
  self.lastMousePosition = [0, 0];

  self.settings = [];

  self.isActive = ko.observable(false);

  self.bounds = bounds;
  self.bounds.addChangeListener(function () {
    self.onBoundsChange();
  });
};

CanvasElementModel.prototype.setCanvas = function (canvas) {
  this._canvas = canvas;
};

CanvasElementModel.prototype.setPosition = function (x, y) {
  this.bounds.x(x);
  this.bounds.y(y);
}

CanvasElementModel.prototype.onDrag = function (x, y, dX, dY, e) {
  var capturedBySettings = this.resolveDragSettings(x, y, dX, dY, e);

  if (!capturedBySettings) {
    this.setPosition(x, y);
  }
};

CanvasElementModel.prototype.resolveDragSettings = function (x, y, dX, dY, e) {
  var isSettingsCallback = false;

  // Call setting callbacks if there are any
  _.forEach(this.settings, function (setting) {
    if (setting.isActive() && setting.callbacks.drag) {
      setting.callbacks.drag(x, y, dX, dY);
      isSettingsCallback = true;
    }
  });

  return isSettingsCallback;
};

CanvasElementModel.prototype.resolveDragStopSettings = function () {
  // Call setting callbacks if there are any
  _.forEach(this.settings, function (setting) {
    if (setting.callbacks.dragStop) {
      setting.callbacks.dragStop();
    }
  });
};

CanvasElementModel.prototype.onDragStop = function () {
  this.resolveDragStopSettings();
};

CanvasElementModel.prototype.getDragCallback = function () {
  var callbacks = [];
  _.forEach(this.settings, function (setting) {
    if (setting.isActive() && setting.callbacks.drag) {
      callbacks.push(setting.drag);
    }
  });

  if (callbacks.length > 0) {
    // We have some setting callbacks
    return function (x, y) {
      _.forEach(callbacks, function (callback) {
        callback(x, y);
      });
    };
  } else {
    // None of the setting callbacks active
    // Default to set position
    return this.setPosition;
  }
};

CanvasElementModel.prototype.activateSetting = function (setting) {
  // Disable other settings
  _.forEach(this.settings, function (tempSetting) {
    if (setting !== tempSetting) {
      if(_.intersection(tempSetting.tags, setting.tagsToDisable).length > 0) {
        tempSetting.deactivate();
      }
    }
  });
  setting.activate();
};

CanvasElementModel.prototype.deactivateSetting = function (setting) {
  // Disable other settings
  setting.deactivate();
};

CanvasElementModel.prototype.onMouseMove = function (e) {
  this.lastMousePosition[0] = e.layerX;
  this.lastMousePosition[1] = e.layerY;
};

CanvasElementModel.prototype.onBoundsChange = function () {};

CanvasElementModel.prototype.onDomInitialized = function () {};

CanvasElementModel.prototype.onMouseWheel = function(event) {
};

module.exports = CanvasElementModel;