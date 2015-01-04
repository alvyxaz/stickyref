/**
 * Created by Alvys on 2014-12-14.
 */

var ko = require('knockout');
var $ = require('jquery');

ko.bindingHandlers.canvas = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var canvasModel = valueAccessor();
    var $element = $(element);

    $element.mousemove(function (e) {canvasModel.onMouseMove(e)});
    $element.mouseup(function (e) {canvasModel.onMouseUp(e)});
    $element.mousedown(function (e) {canvasModel.onMouseDown(e)});

    $element.find('.paste-backdrop').on('paste',function(e) {
      e.preventDefault();
      var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
      canvasModel.controller.addImage(text);
    });

  },
  update: function (element, valueAccessor , allBindings, viewModel, bindingContext) {
  }
};

ko.bindingHandlers.notification = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    var viewModel = bindingContext.$data;
    $(element).animate({"margin-left" : "30px"}, 3000, 'linear').fadeOut('slow', function () {
      $(this).remove();
      bindingContext.$parent.removeNotification(viewModel);
    });
  },
  update: function (element, valueAccessor , allBindings, viewModel, bindingContext) {

  }
};

ko.bindingHandlers.tooltip = {
  init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
    $(element).attr('data-toggle', 'tooltip')
        .attr('data-placement', valueAccessor).tooltip();
  }
}

ko.bindingHandlers.canvasElement = {
  init: function (element, valueAccessor , allBindings, viewModel, bindingContext) {
    var viewModel = bindingContext.$data;

    // Apply on mouse wheel listener
    $(element).mousewheel(function (event) {
      viewModel.onMouseWheel(event);
    });

    element.onmousemove = function (e) {viewModel.onMouseMove(e)};

    if (viewModel.elementType === 'image') {
      // Image specific
      $(element).css({
        'background-image': 'url(' + viewModel.imageUrl + ')'
      });
    }

    viewModel.domElement = element;
    viewModel.onDomInitialized();

  },
  update: function (element, valueAccessor , allBindings, viewModel, bindingContext) {
    var viewModel = bindingContext.$data;
    var bounds = viewModel.bounds;
    $(element).css({
      'width': bounds.width(),
      'height': bounds.height(),
      'top' : bounds.y(),
      'left': bounds.x(),
      'z-index' : viewModel.z()
    });

    if (viewModel.elementType === 'image') {
      var bgPos = viewModel.bgPosition();

      // Image specific
      $(element).css({
        'background-size': viewModel.bgSizeCssValue(),
        'background-position' : bgPos[0]+"px " + bgPos[1]+"px"
      });
    }

  }
};

ko.bindingHandlers.boundsController = {
  update: function (element, valueAccessor , allBindings, viewModel, bindingContext) {
    var controller = valueAccessor();
    $(element).css({
      'top' : controller.y(),
      'left': controller.x()
    });
  }
};