/**
 * Created by alvys on 12/24/2014.
 */
var ko = require('knockout');

var ImageResolver = function (app) {
    var self = this;
    self.app = app;

    self.isVisible = ko.observable(false);
    self.url = ko.observable('');
    self.isValid = ko.observable(false);

};

ImageResolver.prototype.open = function () {
    this.url('');
    this.isValid('false');
    this.isVisible(true);
};

ImageResolver.prototype.close = function () {
    this.isVisible(false);
};

ImageResolver.prototype.add = function () {
    if (this.app.activeCanvas()) {
        this.app.activeCanvas().controller.addImage(this.url());
        this.close();
    }
};

module.exports = ImageResolver;