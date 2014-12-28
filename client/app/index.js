/**
 * Created by Alvys on 2014-12-13.
 */

var $ = require('jquery');
var ko = require('knockout');
var app = require('./app.js');

require('./vendor.js');

var customBindings = require('./other/customBindings.js');
var AppModel = require('./models/appModel.js')

$(document).ready(function () {
  ko.applyBindings(app);
});
