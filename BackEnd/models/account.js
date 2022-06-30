const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const { Schema } = mongoose;

const Account = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    isLoggedIn: {
      type: Boolean,
      default: false,
    },
    hasPetitions: {
      type: Boolean,
      default: false,
    },
    hasProfile: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['regular', 'business', 'politician'],
      default: 'regular',
    },
    dateCreated: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    agreeTerms: {
      type: Boolean,
      default: false,
      required: true,
    },
    passwordResetToken: { String },
    passwordResetExpires: { Date },
    myInfo: { type: Schema.Types.ObjectId, ref: 'UserInfo' },
    myProfile: { type: Schema.Types.ObjectId, ref: 'Profile' },
    myFeed: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    createdPetitions: [{ type: Schema.Types.ObjectId, ref: 'Petition' }],
    signedPetitions: [{ type: Schema.Types.ObjectId, ref: 'Petition' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//encrypts password and removes the confirm password

Account.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hashSync(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

Account.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//this checks to see if passwords are indeed the same

Account.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

Account.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

Account.methods.createPasswordResetToken = function () {
  //create token to use for resetting
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model('Account', Account);
