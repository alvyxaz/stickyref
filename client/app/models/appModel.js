/**
 * Created by Alvys on 2014-12-13.
 */

var ko = require('knockout');
var _ = require('lodash');
var CanvasModel = require('./canvasModel.js');
var ImageResolver = require('./imageResolver.js');
var NotificationController = require('./notificationController.js');

var AppModel = function () {
  var self = this;

  self.canvases = ko.observableArray([]);
  self.activeCanvas = ko.observable(false);
  self.imageResolver = new ImageResolver(self);
  self.notificationController = new NotificationController();

  self.latestCanvasId = 0;

  self.canvasSelection = ko.computed(function () {
    var selections = [];
    self.canvases().forEach(function (canvas) {
      selections.push(canvas.name());
    });
  });

  this.load();

  // Make sure it saves every second
  setInterval(function () {
    self.save();
  }, 2000);
};

AppModel.prototype.addCanvas = function (canvas) {
  this.canvases.push(canvas);
};

AppModel.prototype.newCanvas = function () {
  var canvas = new CanvasModel(this, this.generateCanvasId());
  this.addCanvas(canvas);
  this.activeCanvas(canvas);
};

AppModel.prototype.generateCanvasId = function () {
  this.latestCanvasId++;
  return this.latestCanvasId;
}

AppModel.prototype.prepareFirstUse = function () {

};

AppModel.prototype.save = function () {
  if (this.activeCanvas()) {
    var data = {
      latestCanvasId : this.latestCanvasId,
      canvases: _.map(this.canvases(), function (canvas) {
        return canvas.toJSON();
      }),
      activeCanvasId : this.activeCanvas().id
    };
    localStorage.setItem("stickyref", JSON.stringify(data));
  }
};

AppModel.prototype.load = function () {
  var self = this;
  var data = JSON.parse(localStorage.getItem("stickyref"));

  console.log(data);

  if (!data || data === null) {
    // If it's the first time opening the app
    this.prepareFirstUse();
    return;
  }

  //try {
    // Restore latest id
    this.latestCanvasId = data.latestCanvasId;

    // Restore canvases
    var activeCanvas = undefined;
    _.forEach(data.canvases, function (canvasData) {
      var canvas = new CanvasModel(self, canvasData.id);
      canvas.fromJSON(canvasData);
      self.addCanvas(canvas);
      if (canvasData.id === data.activeCanvasId) {
        activeCanvas = canvas;
      }
    });

    // Setting an active canvas
    if (!activeCanvas) {
      activeCanvas = this.canvases()[0];
    }
    this.activeCanvas(activeCanvas);

  //} catch(err) {
  //  // If we have failed to load stuff
  //  // Reset the app
  //  console.error(err);
  //  this.prepareFirstUse();
  //}

};

module.exports = AppModel;