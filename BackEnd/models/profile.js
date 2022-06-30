const mongoose = require('mongoose');

const { Schema } = mongoose;

const Profile = new Schema(
  {
    profileImg: {
      type: String,
    },
    nickname: {
      type: String,
    },
    aboutYourself: {
      type: String,
    },
    yourCause: {
      type: String,
    },
    myImages: [
      {
        type: String,
      },
    ],
    account: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    myFollowers: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    iFollow: [{ type: Schema.Types.ObjectId, ref: 'Account' }],
    movements: [
      {
        type: String,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Profile', Profile);
