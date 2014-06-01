meanTodo.directive('todoItem', function() {
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