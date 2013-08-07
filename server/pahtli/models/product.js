
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/pahtli_app');

var schema2 = new mongoose.Schema({
    name: String,
    imageUrl: String,
    description: String,
    prescription: { 
		
		sun: Boolean,
		mon: Boolean,
		tue: Boolean,
		wed: Boolean,
		thu: Boolean,
		fri: Boolean,
		sat: Boolean,
		hours: [{
			id: Number,
			time: String,
			qty: Number
		}]
    }
});


module.exports = mongoose.model('ProductX', schema2);
