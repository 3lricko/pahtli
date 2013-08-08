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
	console.log(req.body.prescription.hours[0]);

	var error = { msg: null};
	nimble.series([

		function(callback){

			downloadImage(req.body, function(product, localImageUrl, err){

				if(err) {
					error.msg = true;
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
	Product.find({'_id' : params.id}).remove();

	//res.redirect(PRD_URL);
	res.send("ok");
};

exports.listView = function(req, res, next){

	res.render('products/listView', { title : 'Products' });
};

/*Utils*/

var downloadImage = function(product, callback){
	
	var error;
	var fileName;

	nimble.series([

		function(tc){
			setTimeout(tc,15000);
		},
		function(internalCall){
			request.head(product.imageUrl, function(err, res, body){

				if(err){ 
					error = err;
				}else{
					try{
						
						if(res.headers['content-type'].indexOf('image') < 0) { throw 'Invalid image.' }
						fileName = new Date().valueOf() + "." + res.headers['content-type'].split("/")[1];
						var ws = fs.createWriteStream("./public/img/products/" + fileName);
						ws.on('pipe', function(src) {
						  console.error('something is piping into the writer');
						  
						});
						ws.on('finish', function() {
						  console.log('finish!');
						  internalCall();
						});
						
						var readable = request(product.imageUrl).pipe(ws);
						/*console.log('voy a parar');	
						readable.on('data', function(chunk) {
						  console.log('got %d bytes of data', chunk.length);
						});
						readable.on('end', function() {
						  console.log('there will be no more data.');

						});*/
						
								
					}catch(ex){
						
						error = ex;
						console.trace(ex);
					}
				}
				
			});
		},
		function(internalCall){
			
			callback(product, "/img/products/" + fileName, error);	
			internalCall();		
		}
	]);
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





