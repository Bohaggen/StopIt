const express = require('express');
const multer = require('multer');
const fs = require('fs');

const accountController = require('../controllers/accountController');

const accountRouter = express.Router();
const AppError = require('../utils/appError');

//Handling storage for signatures
const sigStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./polytic/signatures/`);
  },
  filename: function (req, file, cb) {
    cb(null, req.params.id + file.originalname);
  },
});

//Handling storage for signatures
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.params.id;
    const folder = `./static/users/${userId}/profile`;
    if (fs.existsSync(folder)) {
      cb(null, `./static/users/${req.params.id}/profile`);
    } else {
      fs.mkdirSync(folder, { recursive: true });
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.params.id;
    const folder = `./static/users/${userId}/post`;
    if (fs.existsSync(folder)) {
      cb(null, `./static/users/${userId}/profile/post`);
    } else {
      fs.mkdirSync(folder, { recursive: true });
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const galleryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.params.userid;
    const folder = `./static/users/${userId}/gallery`;
    if (fs.existsSync(folder)) {
      cb(null, `./static/users/${userId}/gallery`);
    } else {
      fs.mkdirSync(folder, { recursive: true });
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const sigFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png') {
    cb(new AppError('Not a proper file type', 401), true);
  } else {
    cb(null, false);
  }
};

const profileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(new AppError('Not a proper file type', 401), true);
  } else {
    cb(null, false);
  }
};

const postFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'audio/mpeg' ||
    file.mimetype === 'audio/mp4' ||
    file.mimetype === 'video/3gpp' ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/3gpp' ||
    file.mimetype === 'video/x-ms-wmv'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const galleryFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(new AppError('Not a proper file type', 401), true);
  } else {
    cb(null, false);
  }
};

//Filters for files and sizes
const sig = multer({
  storage: sigStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  sigFilter: sigFilter,
});

const profile = multer({
  storage: profileStorage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  profileFilter: profileFilter,
});

const userpost = multer({
  storage: postStorage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  postFilter: postFilter,
});

const gallery = multer({
  storage: galleryStorage,
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  galleryFilter: galleryFilter,
});

// Actual routes
accountRouter
  .get('/:id', accountController.protect, accountController.getMyAccount)
  .get(
    '/:id/myInfo',
    accountController.protect,
    accountController.getMyUserInfo
  )
  .get('/skip', accountController.skipProfile)
  .post('/login', accountController.login)
  .post('/login/success', accountController.viewLogin)
  .post(
    '/verify/:token',
    accountController.protect,
    accountController.checktoke
  )
  .post('/add', accountController.createAccount)
  .post('/add/view', accountController.viewCreateAccount)
  .post(
    '/add/profile/:id',
    accountController.protect,
    profile.single('profileImg'),
    accountController.createProfileInformation
  )
  .post(
    '/add/profile/:profileid/myImages/:userid',
    accountController.protect,
    gallery.array('myImages'),
    accountController.addImagesToProfile
  )
  .post(
    '/add/post/:id',
    accountController.protect,
    userpost.single('postImg'),
    accountController.createPost
  )
  .put('/logout/:id', accountController.protect, accountController.logout)
  .patch('/resetpassword/:token', accountController.resetPassword)
  .post('/forgotpassword', accountController.forgotPassword)
  .post(
    '/add/userinfo/:id',
    accountController.protect,
    sig.single('signature'),
    accountController.createUserInfo
  );

module.exports = accountRouter;
