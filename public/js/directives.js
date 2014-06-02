meanTodo.directive('tdTodoItem', function() {
  return {
    restrict: 'E',
    scope: "=todo",
    templateUrl: 'templates/todo-item.html'
    ,
    link: function(scope, elem, attrs) {
      scope.icon = attrs.icon;

      elem.bind('mouseup', function() {
        scope.$apply(elem.ngMouseup);
      });
    }
  };
});


meanTodo.directive('tdEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if(event.which === 13) {
        scope.$apply(function(){
          scope.$eval(attrs.tdEnter, {'event': event});
        });

        event.preventDefault();
      }
    });
  };
});