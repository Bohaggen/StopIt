const mongoose = require('mongoose');

const { Schema } = mongoose;

const Petition = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  govType: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  signatures: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  ],
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: [true, 'Must Have an Account to create Petitions'],
  },
  yourReform: {
    type: Schema.Types.ObjectId,
    ref: 'Reform',
  },
});

module.exports = mongoose.model('Petition', Petition);
