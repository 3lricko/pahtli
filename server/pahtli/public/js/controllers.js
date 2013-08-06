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
		prescription: "0 30,00,30 10,18,20 ? *SUN,TUE,WED,THU,FRI,SAT*",
		prescriptionQuantities: [1,1,1],
		days: [],
		prescriptions: [
		{
			id:0,
			time: new Date(0,0,0,12,0,0,0),
			quantity: 0
		}]
	};

	
	$scope.product = emptyProduct;
	$scope.out = "x";
	$scope.productDays = parseDays(emptyProduct.prescription);
	$scope.prescriptionHours = parseHours(emptyProduct.prescription, emptyProduct.prescriptionQuantities);

	$scope.addPrescription = function(){

		var prescriptions =  $scope.prescriptionHours;
		prescriptions.push({
			id: generateId(),
			time: "",
			quantity:1
		});
	}

	$scope.deletePrescription = function(prescriptionId){

		var prescriptions = $scope.prescriptionHours;
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

var parseDays = function(prescription){

	var prescriptionItems = parsePrescriptionItems(prescription);

	return [ {label: "Sun", checked: prescriptionItems[4].indexOf("SUN") >= 0},
		{label: "Mon", checked: prescriptionItems[4].indexOf("MON") >= 0 },
		{label: "Tue", checked: prescriptionItems[4].indexOf("TUE") >= 0 },
		{label: "Wed", checked: prescriptionItems[4].indexOf("WED") >= 0 },
		{label: "Thu", checked: prescriptionItems[4].indexOf("THU") >= 0 },
		{label: "Fri", checked: prescriptionItems[4].indexOf("FRI") >= 0 },
		{label: "Sat", checked: prescriptionItems[4].indexOf("SAT") >= 0 }];
}

var parseHours = function(prescription, prescriptionQuantities){

	var prescriptionHours = [];
	var prescriptionItems = parsePrescriptionItems(prescription);

	var mins = prescriptionItems[1].split(",");
	var hours = prescriptionItems[2].split(",");

	if(mins.length > hours.length || hours.length > prescriptionQuantities.length) throw WRONG_CRON_ERROR;

	for(var i = 0; i < hours.length; i++){

		prescriptionHours.push({
			id: generateId()+i,
			time: hours[i] + ":" + (i < mins.length ? mins[i] : mins[mins.lenght-1]),
			quantity: prescriptionQuantities[i]
		});
	}

	return prescriptionHours;
}

var generateId = function(){
	return new Date().valueOf();
}

var parsePrescriptionItems = function(prescription){

	var prescriptionItems = prescription.split(" ");
	if(prescriptionItems.length < 5) throw WRONG_CRON_ERROR;

	return prescriptionItems;

}


