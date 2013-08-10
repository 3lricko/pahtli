var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/pahtli_db');

var schema = new mongoose.Schema({

	name : String,
	imageUrl : String,
	description : String,
	prescription : {

		sun : Boolean,
		mon : Boolean,
		tue : Boolean,
		wed : Boolean,
		thu : Boolean,
		fri : Boolean,
		sat : Boolean,
		hours : [ {
			time : String,
			qty : Number
		} ]
	},
	company_id : Number,
	// Control data.
	create_user_id : Number,
	create_date : Date,
	update_user_id : Number,
	update_date : Date

});

module.exports = mongoose.model('Product', schema);
