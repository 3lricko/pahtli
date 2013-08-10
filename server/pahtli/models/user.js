var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/pahtli_db');

var schema = new mongoose.Schema({

	name : String,
	email : String,
	roles : [ Number ],
	// Control data.
	create_user_id : Number,
	create_date : Date,
	update_user_id : Number,
	update_date : Date

});

module.exports = mongoose.model('User', schema);
