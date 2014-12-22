/**
 * Created by Alvys on 2014-12-13.
 */

var ko = require('knockout');
var CanvasModel = require('./canvasModel.js');

module.exports = function AppModel() {
  var self = this;

  self.canvases = ko.observableArray([]);
  self.activeCanvas = ko.observable(false);

  self.canvasSelection = ko.computed(function () {
    var selections = [];
    self.canvases().forEach(function (canvas) {
      selections.push(canvas.name());
    });
  });

  self.newCanvas = function () {
    var canvas = new CanvasModel();
    self.canvases.push(canvas);
    self.activeCanvas(canvas);
  };

  self.newCanvas();

};