'use strict';

var meanTodo = angular.module('MeanTodo', ['primus'])


  .config(function(primusProvider) {
    primusProvider
        .setEndpoint(location.origin)  // Define Primus endpoint
        .setOptions({  // Define Primus options
          reconnect: {
            minDelay: 1000,
            maxDelay: 60000,
            retries:  100
          }
        });
  })


  .controller("mainController", ["$scope", "$http", "primus",
      function($scope, $http, primus) {

    // in production: get the enum from the back-end
    var TASK_STATE = {
        ACTIVE    : 'Active',
        ON_HOLD   : 'On hold',
        COMPLETE  : 'Complete'
    };

    $scope.TASK_STATE = TASK_STATE;


    /** when landing on the page (i.e. loading controller): **/
    // clear the task entry form
    $scope.task = {};


    // fetch all tasks from the back-end
    $http.get('/api/tasks')
        .success(function(data) {
          $scope.tasks = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });


    /** user actions: **/
    // submit a new task
    $scope.createTodo = function $createTodo() {

      var newTask = amendNewTaskFromScope();  // add default attrs
      $scope.tasks.push(newTask);  // add new task to our list

      // send new task to back-end
      $http.put('/api/tasks', $scope.task)
          .success(function() {
            $scope.task = {};  // clear the form
            angular.element('#name').focus();  // focus on task name field
            console.log("new todo");

            notifyNewTask(newTask);  // notify others
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
    };


    $scope.changeState = function $changeState(taskId, newState) {
      // change state of the task
      updateTaskById(taskId, {state: newState});

      // send changes to the back-end
      $http.post('/api/tasks/' + taskId, {meat: {state: newState}})
          .success(function() {
            console.log("new state: ", newState);

            notifyTaskState(taskId, newState);  // notify others
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
    };


    $scope.deleteTask = function $deleteTask(taskId) {
      // remove task from our list
      deleteTaskById(taskId);

      // send changes to the back-end
      $http.delete('/api/tasks/' + taskId)
          .success(function() {
            console.log("task deleted: ", taskId);

            notifyDeleteTask(taskId);  // notify others
          })
          .error(function(data) {
            console.log('Error: ' + data);
          });
    };


    /** helper functions **/
    // removes first item that has @value from array or object @arr
    var removeFirstById = function removeFirstById(arr, value) {
      for (var b in arr) {  // b = index
        if (arr[b]._id === value) {
          arr.splice(b, 1);
          break;
        }
      }
    };

    $scope.filterActive = function(element) {
      console.log(element);
      return element.state === 'Active';
    };


    // add default attrs to new task
    var amendNewTaskFromScope = function hlpAmendTask() {
      var task = $scope.task;  // name & desc
      task.state = TASK_STATE.ACTIVE;
      task.order = $scope.tasks.length + 1;  // put at the end
      return task;
    };


    // change one or more @props of task with @id
    var updateTaskById = function hlpUpdateById(id, props) {
      angular.forEach($scope.tasks, function (task) {
        if (task._id === id) {
          angular.extend(task, props);
//          task.state = newState;
        }
      });
    };


    // remove task with @id
    var deleteTaskById = function hlpDeleteById(id) {
      removeFirstById($scope.tasks, id);
    };


    /**
     * @primus:
     * @events originated on the client:
     * new task created     - send ('task creation', new_task_object)
     * task order changed   - send ('task order', moved_task_id, moved_before_task_id)
     * task state changed   - send ('task state', task_id, new_state)
     * task deleted         - send ('task deletion', task_id)
     *
     * @events received from the server:
     * incoming:client no   - refresh client no with received number
     * incoming:task creation    - add new task to our list of tasks
     * incoming:task order  - fetch the whole list
     * incoming:task state  - change the task state
     */

    /** helper functions - outgoing socket notifications **/
    // user creates a new task
    var notifyNewTask = function sockNewTask(task) {
      var data = {};
      data.type = "task creation";
      data.meat = task;
      primus.write(data);
    };


    // user drags and drops a task (changes order)
    var notifyTaskOrder = function sockTaskOrder() {
      var data = {};
      data.type = "task order";
      data.meat = $scope.task;
      primus.write(data);
    };


    // user changes task state
    var notifyTaskState = function sockTaskState(taskId, newState) {
      var data = {};
      data.type = "task state";
      data.meat = {id: taskId, state: newState};
      primus.write(data);
    };


    // user deletes a task
    var notifyDeleteTask = function sockDeleteTask(taskId) {
      var data = {};
      data.type = "task deletion";
      data.meat = {id: taskId};
      primus.write(data);
    };



    /** incoming socket notifications **/
    primus.$on('data', function news(data) {

      switch (data.type) {

        case 'client no':
//          console.log('client no', data);
          $scope.clients = data.meat.clients;  // put info on $scope
          break;

        case 'task creation':
//          console.log('task creation', data);
            $scope.$apply($scope.tasks.push(data.meat));
          break;

        case 'task order':
          console.log('tasks order', data);
          updateTaskById(data.meat.id, {state: data.meat.state});
          break;

        case 'task state':
          console.log('tasks state', data);
          updateTaskById(data.meat.id, {state: data.meat.state});
          break;

        case 'task deletion':
          console.log('tasks deletion', data);
          deleteTaskById(data.meat.id);
          break;
      }
    });


  }]);



