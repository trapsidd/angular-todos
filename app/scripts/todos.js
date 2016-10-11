angular
  .module('todos', ['ngAnimate'])
  .controller('TodosCtrl', TodosCtrl)
  .factory('Todos', Todos)
  .directive('todoFocus', todoFocus)
  .directive('todoEscape', todoEscape)
  .directive('todos', todos);

function todos() {
  return {
    restrict: 'E',
    templateUrl: './scripts/templates/todos.html',
    controller: 'TodosCtrl',
    controllerAs: 'tc'
  };
}

function todoFocus($timeout) {
  return function todoFocusLink(scope, elem, attrs) {
    scope.$watch(attrs.todoFocus, function(newVal) {
      if(newVal) {
        $timeout(function() {
          elem[0].focus();
        }, 0, false);
      }
    });
  }
}


function todoEscape() {
  return function todosEscapeLink(scope, elem, attrs) {
    var KEY = 27;

    elem.bind('keydown', function(e) {
      if(e.keyCode === KEY) {
        //console.log(attrs.todoEscape);
        scope.$apply(attrs.todoEscape);
      }
    });

    scope.$on('$destroy', function() {
      elem.unbind('keydown');
    });

  }
}

function Todos() {
  var STORAGE_ID = "todos-store";
  return {
    get: function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID)) || [];
    },

    set: function(todos) {
      return localStorage.setItem(STORAGE_ID, JSON.stringify(todos));
    }
  }
}

function TodosCtrl($scope, Todos) {
  var vm = this;
  var todos = vm.todos = Todos.get();

  vm.newTodo = {};
  vm.activeTodo = {};
  vm.create = create;
  vm.remove = remove;
  vm.update = update;
  vm.revert = revert;
  vm.editTodo = editTodo;
  vm.show = show;
  vm.filter = {
    completed: false
  };

  $scope.$watch('tc.todos', function() {
    Todos.set(todos);
  }, true);

  function reset() {
    vm.newTodo = {
      name: '',
      completed: false
    };
  }

  function create() {
    var name = vm.newTodo.name = vm.newTodo.name.trim();
    if (!name) {
      return;
    }

    todos.push(vm.newTodo);
    reset();
  }

  function remove(idx) {
    todos.splice(idx, 1);
  }

  function update(todo, idx) {
    vm.activeTodo = {};
    todo.name = todo.name.trim();

    if(!todo.name) {
      vm.remove(idx)
    }
  }

  function revert(idx) {
    vm.todos[idx] = vm.originalTodo;
    vm.activeTodo = {};
  }

  function editTodo(todo) {
    vm.activeTodo = todo;
    vm.originalTodo = angular.copy(todo);
  }


  function show(filter) {
    vm.filter.completed = filter === 'active' ? false : true;
    console.log(filter);
  }

  reset();

}

TodosCtrl.$inject = ["$scope", "Todos"];
