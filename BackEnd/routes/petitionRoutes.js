const express = require('express');
const petitionController = require('../controllers/petitionController');
const accountController = require('../controllers/accountController');

const petitionRouter = express.Router();

petitionRouter
  .get('/:id', accountController.protect, petitionController.getMyPetitions)
  .get(
    '/signed/:id',
    accountController.protect,
    petitionController.getSignedPetitions
  )
  .get('/one/:id', accountController.protect, petitionController.getOnePetition)
  .get(
    '/category/:category',
    accountController.protect,
    petitionController.getByCategory
  )
  .get(
    '/:userid/hassigned/:id',
    accountController.protect,
    petitionController.checkSignedPetition
  )
  .post(
    '/add/:id',
    accountController.protect,
    petitionController.createPetition
  )
  .post(
    '/:userid/sign/:id',
    accountController.protect,
    petitionController.signPetition
  )
  .delete(
    '/mypetitions/:id',
    accountController.protect,
    petitionController.deleteMyPetition
  );

module.exports = petitionRouter;
