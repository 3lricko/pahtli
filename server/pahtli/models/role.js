
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pahtli_db');

var schema = new mongoose.Schema({
    
	name: String,
    //Control data.
    create_user_id: Number,
	create_date: Date,
	update_user_id: Number,
	update_date: Date
	
});

module.exports = mongoose.model('Role', schema);
