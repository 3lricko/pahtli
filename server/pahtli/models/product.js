
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pahtli_app');

var schema = new mongoose.Schema({
    name: String,
    image: String,
    description: String});

module.exports = mongoose.model('Product', schema);
