'use strict'

/*Constants*/
var WRONG_CRON_ERROR = "Wrong cron configuration!";

/*Controllers*/

function ProductListCtrl($scope, $http){


	loadJsonProducts($scope, $http);
	
	$scope.showProductContent = function(){

		$http.get('/admin/products/listView').success(function(data) {

			$scope.content = data;

		});
	}

	$scope.deleteProduct = function(id){

		$scope.out = id;

		$http.get('/admin/products/delete?id='+id).success(function(data) {

			loadJsonProducts($scope, $http);

		});

	}
}

function ProductFormCtrl($scope, $http){

	var prescription = {

		sun: false,
		mon: false,
		tue: false,
		wed: false,
		thu: false,
		fri: false,
		sat: false,
		hours: [{
			id:0,
			time:null,
			qty: 1
		}]
	};
	var emptyProduct = {
		name: '',
		imageUrl: '',
		description: '',
		prescription: prescription
	};

	
	$scope.product = emptyProduct;
	
	$scope.addPrescriptionHour = function(){

		var hours =  $scope.product.prescription.hours;
		hours.push({
			id: generateId(),
			time: "",
			qty:1
		});
	}

	$scope.deletePrescriptionHour = function(hourId){

		var hours = $scope.product.prescription.hours;
		var filtered = hours.filter(function(item){return item.id == hourId;});
		
		if(filtered == null || filtered.length == 0) return;
		var iToDelete = hours.indexOf(filtered[0]);
		if(iToDelete >= 0)
			hours.splice(iToDelete,1);
	}

	$scope.submit = function(){

		$http.post("/admin/products", $scope.product).success(function(data){
    		$scope.out = "server response = " + data;
		});
		
	}

	$scope.cancel = function(){

		$scope.out = $scope.product.prescription.hours;
	}
}


/*Utils*/

var loadJsonProducts = function(scope, http){

	http.get('/admin/products/json/').success(function(data) {
		scope.products = data;
	});
}

var generateId = function(){
	return new Date().valueOf();
}



