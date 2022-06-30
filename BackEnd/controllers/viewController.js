const Account = require('../models/account');
const Petition = require('../models/petition');
const Profile = require('../models/profile');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.signUp_In = catchAsync(async (req, res, next) => {
  res.status(200).render('signup');
});

exports.loginSuccess = catchAsync(async (req, res, next) => {
  const user = await (
    await Account.findById(req.cookies.user).populate('myProfile')
  ).populate('myInfo', 'firstName', 'lastName');
  if (!user) {
    return next(new AppError('You Are Not Logged in Please Login', 400));
  }
  if (!user.hasProfile) {
    res
      .status(200)
      .render('createProfile', { title: `Polytic | CreateProfile` });
  } else {
    res.render('home', {
      title: `Polytic | Welcome ${user.username}`,
      user: user,
      myProfile: user.myProfile,
    });
  }
});

exports.goHome = catchAsync(async (req, res, next) => {
  res.status(200).render('home');
});

exports.createProfile = catchAsync(async (req, res, next) => {
  const user = await Account.findById(req.cookies.user).populate('myProfile');
  if (!user) {
    res.render('login');
  } else {
    res.status(200).render('createProfile', {
      title: `Polytic | Welcome ${user.username}`,
      user: user,
      myProfile: user.myProfile,
    });
  }
});

exports.myHomePage = catchAsync(async (req, res, next) => {
  const user = await Account.findById(req.cookies.user).populate('myProfile');
  if (!user) {
    res.render('login');
  } else {
    res.status(200).render('home', {
      title: `Polytic | Welcome ${user.username}`,
      user: user,
      myProfile: user.myProfile,
    });
  }
});

exports.myGallery = (req, res) => {
  res.status(200).render('gallery');
};
