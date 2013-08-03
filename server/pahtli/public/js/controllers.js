'use strict'

/*Controllers*/
function ProductListCtrl($scope, $http){

	loadJsonProducts($scope, $http);

  	$scope.deleteProduct = function(productName){

  		$http.get('/admin/products/delete?name='+productName).success(function(data) {
	   			
    		loadJsonProducts($scope, $http);

  		});

  	}
}

var loadJsonProducts = function(scope, http){

	http.get('/admin/products/json/').success(function(data) {
    	scope.products = data;
    });
}



