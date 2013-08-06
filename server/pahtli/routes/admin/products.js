
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
const PRD_URL = '/admin/products/';

var Product = require('../../models/product');
var path = require('path');
var fs = require('fs');
var join = path.join;
var url = require('url');

exports.json = function(req, res, next){

	Product.find({},function(err, products){
		if(err) return next(err);
		res.send(products);
	});
}

exports.list = function(req, res, next){

	var query = {};
	var name = url.parse(req.url,true).query.name;
	console.log(name);
	if(name != null)
		query = {name : new RegExp(name, "i")};
	console.log(query);
	Product.find(query, function(err, products){
		if(err) return next(err);
		res.render('products/products', { title : 'Products', products : products });
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
	res.json(true);
};

exports.delete = function(req, res, next){

	console.log("delete");
	var params = url.parse(req.url, true).query;

	Product.find({'name' : params.name}).remove();

	//res.redirect(PRD_URL);
	res.send("ok");
};

exports.listView = function(req, res, next){

	res.render('products/listView', { title : 'Products' });
}






