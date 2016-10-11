angular.module('github', ['ngAnimate'])
  .factory('GithubService', GithubService)
  .controller('GithubCtrl', GithubCtrl)
  .directive('fadeIn', FadeIn)
  .directive('github', Github);


var REPO_LIMIT = 4;

function FadeIn($animate) {
  return {
    link: function(scope, elem, attrs) {
      elem.css('opacity', 0);
      elem.on('load', function() {
        elem.attr('src', attrs.ngSrc);
        elem.css('opacity', 1);
      });
    }
  }
}

function Github() {
  return {
    restrict: 'E',
    templateUrl: 'scripts/templates/github.html',
    controller: 'GithubCtrl',
    controllerAs: 'github'
  };
}

function GithubService($http, $q) {
  var base_url = "http://api.github.com";

  function getInfo(name) {
    var user = $http.get(base_url + '/users/' + name);
    var repos = $http.get(base_url + '/users/' + name + '/repos?sort=updated');
    
    return $q.all([user, repos]);
  }

  return {
    info: getInfo
  };
}

GithubService.$inject = ['$http', '$q'];

function GithubCtrl(GithubService) {
  var vm = this;

  vm.what = '';
  vm.info = {};
  vm.loading= false;
  vm.getInfo = getInfo;

  function getInfo() {
    vm.loading = true;
    if(!vm.what) return;
    GithubService.info(vm.what).then(function(res) {
      var user = res[0].data;
      var repos = res[1].data.filter(function(i) {
        return i.stargazers_count;
      }).sort(function(a, b) {
        return a.stargazers_count-b.stargazers_count;
      }).reverse().slice(0, REPO_LIMIT);

      vm.loading = false;
      vm.info = {
        user: user,
        repos: repos
      };
    });
  }
}

GithubCtrl.$inject = ['GithubService'];
