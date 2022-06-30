const mongoose = require('mongoose');

const { Schema } = mongoose;

const Reform = new Schema({
  title: {
    type: String,
    required: true,
  },
  comment: {
    String,
    required: true,
  },
});

module.exports = mongoose.model('Reform', Reform);
