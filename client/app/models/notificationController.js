/**
 * Created by alvys on 12/25/2014.
 */

var ko = require('knockout');

var NotificationController = function () {
    var self = this;

    self.notifications = ko.observableArray([]);

};

NotificationController.prototype.addNormal = function (message) {
    this.notifications.push(new Notification(message, 'normal'));
};

NotificationController.prototype.addWarning = function (message) {
    this.notifications.push(new Notification(message, 'warning'));
};

NotificationController.prototype.addError = function (message) {
    this.notifications.push(new Notification(message, 'error'));
};

NotificationController.prototype.removeNotification = function (notification) {
  this.notifications.remove(notification);
};

var Notification = function (message, type) {
    this.message = message;
    this.type = type;
};

module.exports = NotificationController;