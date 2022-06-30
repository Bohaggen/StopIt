const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Account = require('../models/account');
const UserInfo = require('../models/userInfo');
const Profile = require('../models/profile');
const Post = require('../models/post');

dotenv.config({ path: './config/config.env' });

//Creates our token
const signToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//redirect if you are on website

//used for logging in for website
const createSendToken = (user, statusCode, res) => {
  const Token = signToken(user._id, user.username);
  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', Token, cookieOption);
  res.cookie('user', user.id, cookieOption);
  user.password = undefined;
  if (!user.myProfile) {
    res.redirect('/createProfile');
  } else {
    res.redirect('/scroll');
  }
};

//create account through website
exports.viewCreateAccount = catchAsync(async (req, res, next) => {
  req.body.agreeTerms = Boolean(req.body.agreeTerms);
  const newAccount = await Account.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    agreeTerms: req.body.agreeTerms,
  });
  createSendToken(newAccount, 201, res);
});

//name is self explainatory
exports.createAccount = catchAsync(async (req, res, next) => {
  const newAccount = await Account.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    agreeTerms: req.body.agreeTerms,
  });

  res.status(201).json({
    status: 'Your Account has been successfully created. Welcome to Polytic!',
    data: newAccount,
  });
});

//this login is for the app
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide username and/or password', 400));
  }
  //check if user exists && password is correct
  const user = await Account.findOne({ username }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect username or password', 401));
  }
  await Account.findByIdAndUpdate(
    user._id,
    {
      $set: { isLoggedIn: true },
    },
    { new: true }
  );
  const Token = signToken(user._id, user.username);
  res.status(200).json({
    Token,
    UserId: user.id,
  });
});

//only used with the website version
exports.viewLogin = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide username and/or password', 400));
  }
  //check if user exists && password is correct
  const user = await Account.findOne({ username }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.redirect('/');
  }
  await Account.findByIdAndUpdate(
    user._id,
    {
      $set: { isLoggedIn: true },
    },
    { new: true }
  );
  createSendToken(user, 200, res);
});

exports.skipProfile = catchAsync(async (req, res, next) => {
  res.status(200).render('home');
});

//////////////////////////////////////////////////////////////////////////////////////////Create Profile For User
exports.createProfileInformation = catchAsync(async (req, res, next) => {
  const myUser = await Account.findById(req.params.id);
  if (!myUser) {
    return next(new AppError('No user can be found! Please relogin', 400)).then(
      res.status(400).render('signup')
    );
  }
  const newProfile = await Profile.create({
    profileImg: req.file.path,
    nickname: req.body.nickname,
    aboutYourself: req.body.aboutYourself,
    yourCause: req.body.yourCause,
    account: req.params.id,
  });
  await Account.findByIdAndUpdate(req.params.id, {
    $set: { myProfile: newProfile.id },
  });
  newProfile.save().then(() => {
    res.status(200).redirect('/scroll');
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const user = await Account.findById(req.params._id);
  if (!user) {
  }
});

exports.addImagesToProfile = catchAsync(async (req, res, next) => {
  const paths = req.files.map((file) => file.path);
  await Profile.findByIdAndUpdate(
    req.params.profileid,
    {
      $push: { myImages: paths },
    },
    { new: true }
  );
  res.status(200).json({
    status: 'Successfully Added your Images to profile',
  });
});

//Logout For website
exports.logout = catchAsync(async (req, res, next) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    res.redirect('/sign-up');
  }
  res.clearCookie('user');
  res.clearCookie('jwt');
  account.update({ _id: account._id }, { $set: { isLoggedIn: false } });
  if (!account.isLoggedIn) {
    res.redirect('/sign-up');
  }
});

exports.getMyAccount = async (req, res, next) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    return next(
      new AppError('No Account Available at this time please login again', 401)
    );
  }
  res.status(200).json({
    status: 'Successfully retrieved your account information!',
    data: account,
  });
};

exports.createUserInfo = catchAsync(async (req, res, next) => {
  const newUserinfo = await UserInfo.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    address: req.body.address,
    state: req.body.state,
    zip: req.body.zip,
    phone: req.body.phone,
    dateOfBirth: req.body.dateOfBirth,
    signature: req.file.path,
    account: req.params.id,
  });
  await Account.findByIdAndUpdate(
    req.params.id,
    {
      $set: { myInfo: newUserinfo.id },
    },
    { new: true }
  );
  newUserinfo.save().then(() => {
    res.json('New UserInfo created');
  });
});

exports.getMyUserInfo = (req, res) => {};

//Protected Routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please Log in to continue', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const myUser = await Account.findById(decoded.id);
  if (!myUser) {
    return next(
      new AppError(
        'User Belonging to this token no longer exist, Please Re-login',
        401
      )
    );
  }
  next();
});

//For Rendered webpages only similar to protected routes but will check from website instead
exports.hasLoggedIn = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const myUser = await Account.findById(decoded.id);
    if (!myUser) {
      return next();
    }
  //this checks to see if user changed password shortly after token issued
    if (myUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }
    res.locals.user = myUser;
    next();
  }
  next();
});

//Only used by mobile app no where else automatically brings the user to the next page within the app
exports.checktoke = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return next(new AppError('No Token Available Please Login Again!', 401));
  }
  jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return next(
        new AppError('You are not validated, Please Login again!', 404)
      );
    }
  });
  res.status(200).json({
    status: 'success',
    message: 'User Is Authenticated',
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const newPost = await Post.create({
    postImg: req.file.path,
    title: req.body.title,
    description: req.body.description,
  });
  await Account.findByIdAndUpdate(
    req.params.id,
    {
      $set: { myFeed: newPost._id },
    },
    { new: true }
  );
  newPost.save().then(() => {
    res.json('Your Post has been added');
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await Account.findOne({ username: req.body.username });

  if (!user) {
    return next(
      new AppError('User does not exist sorry for the inconvenience!', 404)
    );
  }
  //Generate token the random reset token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  //send it to users email
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await Account.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  //If token has not expired
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  //Update changedPasswordAt

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await Account.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.password, user.password))) {
    return next(new AppError('Your current password is wrong', 401));
  }

  user.password = req.body.password;

  await user.save();

  createSendToken(user, 200, res);
});
