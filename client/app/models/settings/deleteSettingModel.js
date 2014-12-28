/**
 * Created by Alvys on 2014-12-14.
 */
var ko = require('knockout');
var ElementSettingModel = require('./elementSettingModel.js');

var DeleteSettingModel = function (canvasElement) {
    ElementSettingModel.call(this, 'glyphicon-remove', canvasElement);
    var self = this;
}

DeleteSettingModel.prototype = Object.create(ElementSettingModel.prototype)
DeleteSettingModel.prototype.constructor = DeleteSettingModel;

DeleteSettingModel.prototype.onClick = function () {
    this.canvasElement.destroy();
};

module.exports = DeleteSettingModel;