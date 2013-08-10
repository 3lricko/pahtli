
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pahtli_db');

var schema = new mongoose.Schema({
    
	user_id: Number,
	products: [Number],
	//Control data.
    create_user_id: Number,
	create_date: Date,
	update_user_id: Number,
	update_date: Date

});

module.exports = mongoose.model('Client', schema2);
