'use strict'
/*var products = [];

products.push({
    
    name : 'BiOmega',
    image : 'http://shop.usana.com/media/Shop/2012Rebrand/US/Products/lg-122-US-Biomega.jpg',
    description : 'Provides advanced and guaranteed levels of EPA and DHA, two long-chain omega-3 fatty acids important for memory and learning,Supports sound cardiovascular, immune, health and joint health'
});

products.push({
    
    name : 'Body Rox',
    image : 'http://shop.usana.com/media/Shop/2012Rebrand/US/Products/lg-104-US-BodyRox.jpg',
    description : 'Provides advanced and guaranteed levels of EPA and DHA, two long-chain omega-3 fatty acids important for memory and learning,Supports sound cardiovascular, immune, health and joint health'
});
*/

//CONSTANTS
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

exports.list = function(req, res, next){

	/*var query = {};
	var name = url.parse(req.url,true).query.name;
	console.log(name);
	if(name != null)
		query = {name : new RegExp(name, "i")};
	console.log(query);
	Product.find(query, function(err, products){
		if(err) return next(err);
		res.render('products/products', { title : 'Products', products : products });
	});*/

Product.find({}, function(err, products){
	if(err) return next(err);
		//res.render('products/products', { title : 'Products', products : products });
		console.log(products);
		res.send(products);
	});


};

exports.form = function(req, res){

	res.render('products/productsUpdateForm', { title : 'Product Form' });
};

exports.submit = function(dir){

	return function(req, res, next){
		
		var img = req.files.product.image;
		var name = req.body.product.name || img.name;
		var description = req.body.product.description;
		var path = join(dir, img.name);

		fs.rename(img.path, path, function(err){ 

			if(err)return next(err);

			Product.create({
				name: name,
				image: '/img/products/' + img.name,
				description: description },
				function(err){
					if(err) return next(err);
					res.redirect(PRD_URL); 
				});
		});
	};
};

exports.create = function(req, res, next){

	console.log(req.body);
	
	var error = { msg: null};
	nimble.series([

		function(callback){

			downloadImage(req.body, function(product, localImageUrl, err){

				console.log("err = " + err);
				if(err) {
					error.msg = true;
					callback();
				}else{
					product.imageUrl = localImageUrl;
					Product.create(product,function(err){
						if(err) {
							console.trace(err);
							error.msg = true;
						}else{
							console.log("product created.");
						}
						callback();
					});
				}
			});
		},
		function(callback){
			console.log("Has errors? " + error.msg);
			res.json(error.msg == null ? true : false);
			callback();		
		}
		]);
	
};

exports.delete = function(req, res, next){

	
	var params = url.parse(req.url, true).query;
	console.log("delete" + params.id);
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

/*Utils*/

var downloadImage = function(product, callback){
	
	var error;
	var fileName;

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

			var readable = request(product.imageUrl).pipe(ws);

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
			error.msg = true;
		}else{
			console.log("product created.");
		}

		callback();
	});


};





