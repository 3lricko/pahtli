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

function IndexCtrl($scope, $http){


	$http.get('/admin/products/json/').success(function(jsonProducts) {
    			$scope.products = jsonProducts;
    		});
	
	$scope.showProductContent = function(){

		$http.get('/admin/products/listView').success(function(data) {

    		$scope.content = data;
		
  		});
	}

	$scope.deleteProduct = function(productName){

  		$http.get('/admin/products/delete?name='+productName).success(function(data) {
	   			
    		loadJsonProducts($scope, $http);

  		});

  	}
}



