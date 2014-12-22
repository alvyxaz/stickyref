/**
 * Created by Alvys on 2014-12-14.
 */

var DRAG_THRESHOLD = 10;

var DraggingEventModel = function () {
  var self = this;
  self.isDragging = false;
  self.$element = undefined;
  self.initialX = 0;
  self.initialY = 0;
  self.initialPointerX = 0;
  self.initialPointerY = 0;
  self.callback = undefined;
  self.callbackStop = undefined;
}

DraggingEventModel.prototype.setup = function ($element, mouseDownEvent, callback, callbackStop) {
  this.isDragging = false;
  this.$element = $element;
  this.initialX = parseInt($element.css('left'), 10);
  this.initialY = parseInt($element.css('top'), 10);
  this.callback = callback;
  this.callbackStop = callbackStop;
  this.initialPointerX = mouseDownEvent.x;
  this.initialPointerY = mouseDownEvent.y;
}

DraggingEventModel.prototype.update = function (e) {
  var xOffset = e.x - this.initialPointerX;
  var yOffset = e.y - this.initialPointerY;
  if (!this.isDragging) {
    this.isDragging = Math.abs(xOffset) > DRAG_THRESHOLD
                    || Math.abs(yOffset) > DRAG_THRESHOLD;
  } else {
    if (this.callback) {
      this.callback(this.initialX+ xOffset, this.initialY + yOffset, xOffset, yOffset);
    }
  }
};

DraggingEventModel.prototype.isActive = function () {
  return this.$element !== undefined;
}

DraggingEventModel.prototype.stop = function () {
  this.$element = undefined;
  this.isDragging = false;

  if (this.callbackStop) {
    this.callbackStop();
  }
  this.callbackStop = undefined;
}


module.exports = DraggingEventModel;