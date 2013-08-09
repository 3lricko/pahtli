'use strict';

/* App Module */

var app = angular.module('pahtliApp', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/admin/products/listView', {templateUrl: '/partials/products/listView.html',   controller: ProductListCtrl}).
      when('/admin/products/formView', {templateUrl: '/partials/products/formView.html',   controller: ProductFormCtrl}).
      otherwise({redirectTo: '/admin/products/listView'});
}]);

app.factory('$whiteBoard', function(){
	return { data: null, clean : function(){ this.data = null;} };
});
