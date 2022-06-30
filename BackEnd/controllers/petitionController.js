const Account = require('../models/account');
const Petition = require('../models/petition');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createPetition = catchAsync(async (req, res, next) => {
  const myAccount = Account.findById(req.params.id);

  if (!myAccount) {
    return next(
      new AppError(
        'Sorry for the inconvenience, please login in or create account',
        401
      )
    );
  }
  const newPetition = await Petition.create({
    title: req.body.title,
    description: req.body.description,
    govType: req.body.govType,
    category: req.body.category,
    account: req.params.id,
  });

  await Account.findByIdAndUpdate(
    req.params.id,
    {
      $push: { createdPetitions: newPetition._id },
      $set: { hasPetitions: true },
    },
    { new: true }
  );
  newPetition.save().then(() => {
    res.json('New Petition has been created! Start Getting Signatures!');
  });
});

exports.signPetition = catchAsync(async (req, res, next) => {
  const user = await Account.findById(req.params.userid);
  const petition = await Petition.findById(req.params.id);
  if (!petition || !user) {
    return next(
      new AppError(
        'No petition found, No Account Find by this Id, Are You logged In?',
        401
      )
    );
  }
  await Petition.findByIdAndUpdate(
    petition._id,
    {
      $push: { signatures: user._id },
    },
    { new: true }
  );
  await Account.findByIdAndUpdate(
    user._id,
    {
      $push: { signedPetitions: petition._id },
    },
    { new: true }
  );
  res.status(200).json({
    status: 'You have Signed your petition',
  });
});

//Check if user already signed Petition
exports.checkSignedPetition = catchAsync(async (req, res, next) => {
  const user = await Account.findById(req.params.userid);
  const petition = await Petition.findById(req.params.id);

  if (!user || !petition) {
    return next(
      new AppError('Cannot find Your User or Petition, Please Try Again', 401)
    );
  }
  if (petition.signatures.indexOf(user.id) === -1) {
    return next(new AppError('User Has Not Signed this petition', 401));
  }
  res.status(200).json({
    status: 'You have already signed this petition',
  });
});

exports.getMyPetitions = catchAsync(async (req, res, next) => {
  const myAccountPetitions = await Account.findById(req.params.id).populate(
    'createdPetitions'
  );
  if (!myAccountPetitions) {
    return next(
      new AppError('No Petitions at this time, Go make a change!', 401)
    );
  }
  res.status(200).json({
    status: 'Found Your Petitions!',
    myAccountPetitions: myAccountPetitions.createdPetitions,
  });
});

exports.getSignedPetitions = catchAsync(async (req, res, next) => {
  const mySignedPetitions = await Account.findById(req.params.id).populate(
    'signedPetitions'
  );

  if (!mySignedPetitions) {
    return next(
      new AppError('You do not have any signed signatures at the time', 401)
    );
  }
  res.status(200).json({
    status: 'Found Your Signed Petitions',
    mySignedPetitions: mySignedPetitions.signedPetitions,
  });
});

exports.getOnePetition = catchAsync(async (req, res, next) => {
  const petition = await Petition.findById(req.params.id).populate(
    'account',
    'username'
  );

  if (!petition) {
    return next(
      new AppError('Could not find your petition please look again', 401)
    );
  }
  res.status(200).json({
    status: 'Found Your Petition',
    petition,
  });
});

exports.getByCategory = catchAsync(async (req, res, next) => {
  const categoryPetition = await Petition.find({
    category: req.params.category,
  });
  if (!categoryPetition) {
    return next(
      new AppError(
        'No Category Selected or No Petitions with that Category created yet',
        401
      )
    );
  }
  res.status(200).json({
    status: 'Found Your Petitions!',
    categoryPetition,
  });
});

exports.deleteMyPetition = (req, res) => {};
