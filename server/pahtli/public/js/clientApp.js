'use strict';

/* App Module */

angular.module('pahtliApp', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/admin/products/listView', {templateUrl: '/partials/products/listView.html',   controller: IndexCtrl}).
      //when('/phones/:phoneId', {templateUrl: 'partials/phone-detail.html', controller: PhoneDetailCtrl}).
      otherwise({redirectTo: '/admin/products/listView'});
}]);
