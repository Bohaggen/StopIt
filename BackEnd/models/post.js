const mongoose = require('mongoose');

const { Schema } = mongoose;

const Post = new Schema({
  postImg: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Post', Post);
