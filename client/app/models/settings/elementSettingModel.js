/**
 * Created by Alvys on 2014-12-14.
 */

var ko = require('knockout');

var ElementSettingModel = function (iconClass, canvasElement) {
  var self = this;
  self.canvasElement = canvasElement;
  self.iconClass = iconClass;
  self.isActive = ko.observable(false);

  self.tags = [];
  self.tagsToDisable = [];

  self.callbacks = {};

}

ElementSettingModel.prototype.onClick = function () {
  this.isActive(!this.isActive());

  if(this.isActive()) {
    // Enabled
    this.canvasElement.activateSetting(this);
  } else {
    // Disabled
    this.canvasElement.deactivateSetting(this);
  }
};

ElementSettingModel.prototype.activate = function () {
  this.isActive(true);
  this.onActivated();
};

ElementSettingModel.prototype.deactivate = function () {
  this.isActive(false);
  this.onDeactivated();
};

ElementSettingModel.prototype.onActivated = function () {
};

ElementSettingModel.prototype.onDeactivated = function () {
};

ElementSettingModel.prototype.getTitle = function () {
  return this.title ? this.title : 'Tool';
};

module.exports = ElementSettingModel;
