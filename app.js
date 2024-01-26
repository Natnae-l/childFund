const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');



// dotenv configuration
require('dotenv').config()

// initialized app
const app = express();

const limiter = rateLimit({
	windowMs: 9 * 1000,
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Use an external store for consistency across multiple server instances.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)
// connect DB
mongoose.connect(process.env.mongoDB)
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`app listening on port: ${process.env.PORT}`))
  })
  .catch(e => console.log(e.message))


//connect passport
require('./config/passport')(passport)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// global variable
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.title = 'Vision Charity Organization';
  res.locals.success = req.flash('user') ;
  res.locals.error_msg = req.flash('error') || '';
  res.locals.thanks = req.flash('thanks') || '';
  next();
});

// routes 
app.use('/', indexRouter);
app.use('/', usersRouter);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  console.log(err)
  res.render('404')  
});

module.exports = app;
