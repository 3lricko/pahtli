'use strict'

// CONSTANTS
var PRD_URL = '/admin/products/';
var PRD_IMAGE_DIR = "./public/img/products/";

var Product = require('../../models/product');
var path = require('path');
var fs = require('fs');
var join = path.join;
var url = require('url');
var request = require('request');
var nimble = require('nimble');

exports.json = function(req, res, next){

	Product.find({},function(err, products){
		if(err) return next(err);
		res.send(products);
	});
};

exports.getProductById = function(req, res, next){

	var params = url.parse(req.url, true).query;
	
	Product.findById(params.id, function(err, product){
		if(err) return next(err);
		res.send(product);
	});
	

};

exports.list = function(req, res, next){

	Product.find({}, function(err, products){
		
		if(err) return next(err);
		res.send(products);
	});

};

exports.form = function(req, res){

	res.render('products/productsUpdateForm', { title : 'Product Form' });
};


exports.create = function(req, res, next){ 

	console.log(req.body);

	var error = { msg: null};
	nimble.series([

		function(callback){

			downloadImage(req.body, function(product, localImageUrl, err){

				if(err) {
					error.msg = err;
					callback();

				}else{
					product.imageUrl = localImageUrl;

					Product.findById(product._id, function(err, existingPrd){

						console.log("existingPrd = " + existingPrd);
						if(err) error.msg = err;

							if(existingPrd == null){// Insert
								
								Product.create(product,function(err){
									if(err) {
										console.trace(err);
										error.msg = err;
									}else{
										console.log("product created.");
									}
									callback();
								});

							}else{// Update

								existingPrd.name = product.name;
								existingPrd.imageUrl = product.imageUrl;
								existingPrd.description = product.description;
								existingPrd.prescription = product.prescription;
								existingPrd.save();
								
								callback();
							}
						});
				}
			});
		},
		function(callback){
			
			res.send((error.msg == null ? "ok" : error.msg.message));
			callback();		
		}
		]);

};

exports.delete = function(req, res, next){

	var params = url.parse(req.url, true).query;
	console.log("delete" + url.parse(req.url, true).query.id);
	Product.findById(params.id, function(err, product){

		try{
			fs.unlinkSync("./public" + product.imageUrl);
		}catch(ex){
			console.trace(ex);
			res.send(ex);
			return;
		}
		product.remove(function(err){

			res.send(err ? err : "ok");
			console.log("deleted");	
		});	
	});
	
};

exports.listView = function(req, res, next){

	res.render('products/listView', { title : 'Products' });
};

/* Utils */

var toType = function(obj) {
	  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}


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

var downloadImage = function(product, callback){
	
	var error;
	var fileName;

	if(fs.existsSync("./public/"+ product.imageUrl)){
		callback(product, product.imageUrl, error);
		return;
	}

	request.head(product.imageUrl, function(err, res, body){
		
		try{

			if(err){ throw err;}

			if(res.headers['content-type'].indexOf('image') < 0) { throw 'Invalid image.' }

				fileName = new Date().valueOf() + "." + res.headers['content-type'].split("/")[1];
			var ws = fs.createWriteStream(PRD_IMAGE_DIR + fileName);
			
			ws.on('finish', function() {
				console.log('finish!');
				callback(product, "/img/products/" + fileName, error);
			});

			request(product.imageUrl).pipe(ws);

		}catch(ex){
			error = ex;
			console.trace(ex);
			console.log("callback");
			callback(null, null, error);
		}		

	});

};


var persist = function(product, callback, error){

	Product.create(product,function(err){
		if(err) {
			console.log(err);
			error.msg = err;
		}else{
			console.log("product created.");
		}

		callback();
	});


};





