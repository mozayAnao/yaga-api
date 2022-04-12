var createError = require('http-errors');
var express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const config = require('config');
const mongoose = require('mongoose');

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

mongoose
  .connect(config.get('dbConnectionString'))
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB'));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const customerRouter = require('./routes/customers');
const serviceRouter = require('./routes/services');
const vendorRouter = require('./routes/vendors');

var app = express();
app.use(helmet());
app.use(morgan('tiny'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/customers', customerRouter);
app.use('/api/services', serviceRouter);
app.use('/api/vendors', vendorRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
