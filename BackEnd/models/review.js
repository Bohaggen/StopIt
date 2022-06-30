const mongoose = require('mongoose');

const { Schema } = mongoose;

const Review = new Schema({
  rating: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  comment: {
    String,
  },
});

module.exports = mongoose.model('Review', Review);
