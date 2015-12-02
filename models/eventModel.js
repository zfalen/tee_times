var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
	title: String,
	start: String,
	end: String
})

mongoose.model('Event', EventSchema);