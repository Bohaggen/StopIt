const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

router
  .get('/', viewController.signUp_In)
  .get('/createProfile', viewController.createProfile)
  .get('/home', viewController.loginSuccess)
  .get('/scroll', viewController.myHomePage)
  .get('/')
  .get('/mygallery', viewController.myGallery);

module.exports = router;
