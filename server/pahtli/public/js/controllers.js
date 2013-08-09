'use strict'

/*Constants*/
var WRONG_CRON_ERROR = "Wrong cron configuration!";
var notyError;

/*Controllers*/

function ProductListCtrl($scope, $http, $whiteBoard, $location){

	$scope.out = $whiteBoard.data;
	loadJsonProducts($scope, $http);
	
	$scope.showProductContent = function(){

		$http.get('/admin/products/listView').success(function(data) {

			$scope.content = data;

		});
	}

	$scope.deleteProduct = function(id){
		
		$http.get('/admin/products/delete?id='+id).success(function(data) {

			if(data == "ok"){
				$.noty.close(notyError);
				loadJsonProducts($scope, $http);
			}
			else
				notyError = noty({text: 'We are sorry, the product could not be deteled.', layout:'top', type:'error', timeout:false});

		});
	}

	$scope.editProduct = function(id){

		$whiteBoard.data = id;
		$location.path("/admin/products/formView");

	}
}

function ProductFormCtrl($scope, $http, $whiteBoard, $location){

	setProductInContext($whiteBoard, $scope, $http);
	
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
			if(data == "true"){
				$scope.out = "must redirect";
				$location.path("/admin/products/listView");

			}
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

var setProductInContext = function(whiteBoard, scope, http){

	if(whiteBoard.data == null){
		//return an empty product
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
		scope.product =  {
			name: '',
			imageUrl: '',
			description: '',
			prescription: prescription
		};
		
	}else{

		http.get('/admin/product/json/?id='+whiteBoard.data).success(function(data) {
			scope.product = data;
			whiteBoard.clean();
		});
	}

}



