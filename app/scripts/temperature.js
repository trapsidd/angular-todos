angular
  .module('temperature', ['ngAnimate'])
  .controller('TempCtrl', TempCtrl)
  .directive('temp', temp);


  function temp() {
    return {
      restrict: 'E',
      templateUrl: './scripts/templates/temperature.html',
      controller: 'TempCtrl',
      controllerAs: 'tc'
    };
  }

  function mergeSort(arr) {
    if (arr.length < 2)
      return arr;

    var pivot = Math.floor(arr.length/2);
    var left = arr.slice(0, pivot);
    var right = arr.slice(pivot);

    return merge(mergeSort(left), mergeSort(right));
  }

  function merge(left, right) {
    var result = [];
    var li = 0, ri = 0;

    while (li < left.length && ri < right.length) {
      if (left[li] <= right[ri]) {
        result.push(left[li++]);
      } else {
        result.push(right[ri++]);
      }
    }

    while (li < left.length)
      result.push(left[li++]);

    while (ri < right.length)
      result.push(right[ri++]);

    return result;
  }

  function getMedian(arr) {
    var sorted = mergeSort(arr);
    var pivot = Math.floor(sorted.length/2);
    if (sorted.length%2 !== 0) {
      return sorted[pivot];
    } else {
      return (sorted[pivot] + sorted[pivot-1])/2;
    }
  }

function TempCtrl($http) {
  var vm = this;

  vm.temp = null;
  vm.medianVal = null;
  vm.temperatures = [];

  vm.create = create;
  vm.median = median;

  function reset() {
    vm.temp = '';
  }

  function create() {
    var val = vm.temp = parseInt(vm.temp.trim(), 10);

    if(!val)
      return;

    vm.temperatures.push(vm.temp);
    reset();
  }

  function median() {
    vm.medianVal = getMedian(vm.temperatures);
  }

  reset();
}
