var app = angular.module('app', ['todos', 'temperature', 'github', 'ngRoute']);


app.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    template: '<todos></todos>'
  })
  .when('/temp', {
    template: '<temp></temp>'
  })
  .when('/github', {
    template: '<github></github>'
  })
  .otherwise({
    redirectTo: '/todos'
  });
});
