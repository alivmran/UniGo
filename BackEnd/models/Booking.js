const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ride',
    required: true
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  status: {
    type: String,
    enum: ['Requested', 'Confirmed', 'Rejected', 'Completed'], 
    default: 'Requested'
  },
  rating: { 
    type: Number,
    default: 0 
  },
  review: { 
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('booking', BookingSchema);