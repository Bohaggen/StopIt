const path = require('path');
const axios = require('axios');
const express = require('express');
const helmet = require('helmet');
const csp = require('helmet-csp');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const xss = require('xss-clean');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const AppError = require('./utils/appError');

dotenv.config({ path: './config/config.env' });

const accountRouter = require('./routes/accountRoutes');
const viewRouter = require('./routes/viewRoutes');
const petitionRouter = require('./routes/petitionRoutes');

const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static', express.static(path.join(__dirname, 'static')));
//This is where the middleware will go.
//parse application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  bodyParser.json({
    limit: '250kb',
  })
);
//Data Sanitizer, NOSQL Injections
app.use(mongoSanitize());
//Data Sanitizer, XSS
app.use(xss());

//base security headers
app.use(helmet());

app.use(
  csp({
    directives: {
      defaultSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self' http: data:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
    reportOnly: false,
  })
);
//add cookies
app.use(cookieParser());
//limit data grabs
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

app.use('/api', limiter);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//get rid of ability to pollute parameters
app.use(
  hpp({
    whitelist: [
      'use your actual data models for references on what can be queried',
    ],
  })
);

app.use('/', viewRouter);
app.use(`/api/v1/stopit/account`, accountRouter);
app.use(`/api/v1/stopit/petition`, petitionRouter);
app.use(axios);
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  console.log(req.cookies);
  next();
});

//specifying location just in case error can't reach database
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this application!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
