'use strict'

/*Controllers*/

function ProductListCtrl($scope, $http){


	loadJsonProducts($scope, $http);
	
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

function ProductFormCtrl($scope, $http){

	var emptyProduct = {
		name: 'Name',
		image: 'image url',
		description: 'Description',
		days: [],
		prescriptions: [
		{
			id:0,
			time: new Date(0,0,0,12,0,0,0),
			quantity: 0
		}]
	};

	$scope.product = emptyProduct;

	$scope.addPrescription = function(){

		var prescriptions =  $scope.product.prescriptions;
		var id = new Date().valueOf();
		prescriptions.push({
			id: id,
			time: "",
			quantity:0});
	}

	$scope.deletePrescription = function(prescriptionId){

		var prescriptions = $scope.product.prescriptions;
		var filter = prescriptions.filter(function(item){return item.id == prescriptionId;});
		
		if(filter == null || filter.length == 0) return;
		var indexToDelete = prescriptions.indexOf(filter[0]);
		if(indexToDelete >=0)
			prescriptions.splice(indexToDelete,1);
	}
}


/*Utils*/
var loadJsonProducts = function(scope, http){

	http.get('/admin/products/json/').success(function(data) {
		scope.products = data;
	});
}



