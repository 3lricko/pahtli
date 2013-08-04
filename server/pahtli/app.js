
/**
 * Module dependencies.
 */

var express = require('express')
, routes = require('./routes')
, products = require('./routes/admin/products')// ADMIN MODULE
, http = require('http')
, path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('productImages', __dirname + '/public/img/products');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/admin/products', products.list);
app.get('/admin/products/json/', products.json);
app.get('/admin/products/update', products.form);
app.post('/admin/products/update', products.submit(app.get('productImages'))); 
app.get('/admin/products/delete', products.delete);
//VIEWS
app.get('/admin/products/listView', products.listView);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {});
