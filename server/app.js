var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const rateLimit = require("express-rate-limit");

const db = require('./db/connect');
const AuthMiddleware = require('./middlewares/middlewares.auth');
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var clinicsRouter = require('./routes/clinics');
var specialtiesRouter = require('./routes/specialties');
var allcodesRouter = require('./routes/allcodes');
var bookingsRouter = require('./routes/bookings');
var servicesRouter = require('./routes/services');
var patientsRouter = require('./routes/patients');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const authApiLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 phút window
    max: 10, // start blocking after 5 requests
    message: { error: true, message: "Quá nhiều request từ IP này, vui lòng thử lại sau 30 phút" }
});

app.use('/', indexRouter);
app.use('/auth', authApiLimiter, authRouter);
app.use('/users', usersRouter);
app.use('/clinics', clinicsRouter);
app.use('/specialties', specialtiesRouter);
app.use('/allcodes', allcodesRouter);
app.use('/bookings', bookingsRouter);
app.use('/services', servicesRouter);
app.use('/patients', patientsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;