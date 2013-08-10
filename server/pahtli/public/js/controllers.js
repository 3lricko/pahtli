'use strict'

/* Constants */
var WRONG_CRON_ERROR = "Wrong cron configuration!";
var notyError;

/* Controllers */

function ProductListCtrl($scope, $http, $whiteBoard, $location) {

	$scope.out = $whiteBoard.data;
	loadJsonProducts($scope, $http);

	$scope.showProductContent = function() {

		$http.get('/admin/products/listView').success(function(data) {

			$scope.content = data;

		});
	}

	$scope.deleteProduct = function(id) {

		$http.get('/admin/products/delete?id=' + id).success(function(data) {

			if (data == "ok") {
				$.noty.close(notyError);
				loadJsonProducts($scope, $http);
			} else
				showError('We are sorry, the product could not be deteled.');

		});
	}

	$scope.editProduct = function(id) {

		$whiteBoard.data = id;
		$location.path("/admin/products/formView");

	}
}

function ProductFormCtrl($scope, $http, $whiteBoard, $location) {

	setProductInContext($whiteBoard, $scope, $http);

	$scope.addPrescriptionHour = function() {

		var hours = $scope.product.prescription.hours;
		hours.push({
			id : generateId(),
			time : "",
			qty : 1
		});
	}

	$scope.deletePrescriptionHour = function(hour) {

		var hours = $scope.product.prescription.hours;
		// var filtered = hours.filter(function(item) {
		// return item == hour;
		// });

		// if (filtered == null || filtered.length == 0)
		// return;
		var iToDelete = hours.indexOf(hour);
		alert(iToDelete);
		if (iToDelete >= 0)
			hours.splice(iToDelete, 1);
	}

	$scope.submit = function() {

		$http
				.post("/admin/products", $scope.product)
				.success(
						function(data) {

							if (data == "ok") {
								$location.path("/admin/products/listView");
							} else {
								showError(
										'We are sorry, the product could not be created. ',
										data);
							}
						});

	}

	$scope.cancel = function() {

		$scope.out = $scope.product.prescription.hours;
	}
}

/* Utils */

var toString = function(obj) {
	var x;
	var str = '{ ';

	if (obj == null)
		return '';
	for (x in obj) {
		str += x + ": " + obj + ", ";
	}
	str = str.substring(0, str.length - 2);
	str += " }";
	return str;
}

var showError = function(errorMsg, extra) {
	notyError = noty({
		text : errorMsg + (extra != null ? '{' + extra + '}' : ''),
		layout : 'topRight',
		type : 'error',
		timeout : false,
		maxVisible : 5,
		ismissQueue : true
	});
}

var loadJsonProducts = function(scope, http) {

	http.get('/admin/products/json/').success(function(data) {
		scope.products = data;
	});
}

var generateId = function() {
	return new Date().valueOf();
}

var setProductInContext = function(whiteBoard, scope, http) {

	if (whiteBoard.data == null) {
		// return an empty product
		var prescription = {

			sun : true,
			mon : true,
			tue : true,
			wed : true,
			thu : true,
			fri : true,
			sat : true,
			hours : [ {
				time : '12:00',
				qty : 1
			} ]
		};
		scope.product = {
			name : '',
			imageUrl : '',
			description : '',
			prescription : prescription
		};

	} else {

		http.get('/admin/product/json/?id=' + whiteBoard.data).success(
				function(data) {
					scope.product = data;
					whiteBoard.clean();
				});
	}

}
