var app = angular.module("app", []);

app.controller("mainController", function($scope, $http){
  $scope.test = 'WAKA WAKA';

  // when landing on the page, get all todos and show them
  $http.get('/api/todos')
    .success(function(data) {
      $scope.todos = data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  // when submitting the add form, send the text to the node API
  $scope.createTodo = function() {
    $http.post('/api/todos', $scope.formData)
      .success(function(data) {
        $('input').val('');
        $scope.todos = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

  // delete a todo after checking it
  $scope.deleteTodo = function(id) {
    $http.delete('/api/todos/' + id)
      .success(function(data) {
        $scope.todos = data;
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
  };

});