var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  title: String,
  start: String,
  end: String,
  players: Number,
  holes: Boolean,
  walking: Boolean
});

mongoose.model('Event', EventSchema);
