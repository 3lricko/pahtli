var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/pahtli_db');

var schema = new mongoose.Schema({

	dealer_id : Number,
	client_id : Number,
	product_id : Number,
	prescription : {

		sun : Boolean,
		mon : Boolean,
		tue : Boolean,
		wed : Boolean,
		thu : Boolean,
		fri : Boolean,
		sat : Boolean,
		hours : [ {

			id : Number,
			time : String,
			qty : Number
		} ],
		period : {

			start : Date,
			end : Date
		}
	},
	isActive : Boolean,
	// Control data.
	create_user_id : Number,
	create_date : Date,
	update_user_id : Number,
	update_date : Date

});

module.exports = mongoose.model('Prescription', schema);
