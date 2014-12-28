/**
 * Created by Alvys on 2014-12-13.
 */

var ko = require('knockout');
var _ = require('lodash');
var $ = require('jquery');

var ImageModel = require('./imageModel.js');
var BoundsModel = require('./boundsModel.js');
var DraggingEventModel = require('./draggingEventModel.js');
var CanvasController = require('./canvasController.js');

var CanvasModel = function CanvasModel (app, canvasId) {
  var self = this;
  self.app = app;
  self.id = canvasId;

  self.name = ko.observable("Untitled");
  self.controller = new CanvasController(self);

  self.elements = ko.observableArray([]);
  self._activeElement = undefined;

  self.dragging = new DraggingEventModel();
};

CanvasModel.prototype.deleteElement = function (element) {
  this.elements.remove(element);
};

CanvasModel.prototype.toJSON = function () {
  return {
    name: this.name(),
    id: this.id,
    elements: _.map(this.elements(), function (element) {
      return element.toJSON();
    })
  }
};

CanvasModel.prototype.fromJSON = function (data) {
  var self = this;

  // Restoring canvas info
  this.id = data.id;
  this.name(data.name);

  // Restoring elements
  _.forEach(data.elements, function (elementData) {
    if (elementData.elementType === 'image') {
      // Preparing image elements
      ImageModel.fromJSON(elementData, function (image) {
        self.addImage(image);
      })
    }
  });
};

CanvasModel.prototype.addImage = function addImage(image) {
  image.setCanvas(this);
  var maxZ = this.normalizeZ();
  image.z(maxZ+1);
  this.elements.push(image);
  this.sort();

  // Set new element as active
  this.setActiveElement(image);
};

/**
 * Sort by z values from highest to lowest
 */
CanvasModel.prototype.sort = function () {
  this.elements.sort(function (left, right) {
    return left.z() === right.z() ? 0 : (left.z() > right.z() ? -1 : 1);
  });
};

CanvasModel.prototype.setActiveElement = function (element) {
  if (element == this.activeElement) {
    // Avoid resetting the same element
    return;
  }

  if (this.activeElement) {
    // Deactivate current element
    this.activeElement.isActive(false);
  }

  this.activeElement = element;

  if (element) {
    // Ignore if unsetting
    element.isActive(true);
  }
};

/**
 * Removes gaps between element z values and makes sure they start from 0
 * @returns {*}
 */
CanvasModel.prototype.normalizeZ = function () {
  // If collection is empty
  if (this.elements().length == 0) {
    return 0;
  }

  // Normalizing z values
  _.forEach(this.elements(), function (element, index) {
    element.z(index);
  });

  // Returning the maximum z value
  return _.max(this.elements(), function (element) {return element.z();}).z();
};

CanvasModel.prototype.onMouseMove = function (e) {
  if (this.dragging.isActive()) {
    this.dragging.update(e);
  }
};

CanvasModel.prototype.onMouseUp = function (e) {
  this.dragging.stop();
};

CanvasModel.prototype.onMouseDown = function (e) {
  var self = this;
  var $element = $(e.srcElement);

  if ($element.hasClass("canvas-element")){
    // If we've clicked on the canvas element
    var currentlyActive = this.activeElement;
    var potentialyActive = _.find(this.elements(), function (element){
      return element.bounds.coversPosition(e.x, e.y);
    });

    // Set element we have clicked on as active
    if (potentialyActive != currentlyActive) {
      this.setActiveElement(potentialyActive)
    }

    // Setup dragging stuff
    var dragCallback = self.activeElement.getDragCallback();
    this.dragging.setup($element, e, function (x, y, dX, dY) {
      self.activeElement.onDrag(x, y, dX, dY, e);
    }, function () {
      self.activeElement.onDragStop();
    });

  } else if($element.hasClass('bounds-controller')){
    // If we've clicked on the bounds controller
    // Setup dragging stuff
    this.dragging.setup($element, e, function (x, y) {
      self.activeElement.bounds.update(x, y);
    });

  } else if($element.is('.canvas, .paste-backdrop') ){
    this.setActiveElement(undefined);
  }

};

module.exports = CanvasModel;