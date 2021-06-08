var createError = require('http-errors');
var express = require('express');
var sqlite = require("./db/aa-sqlite");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

sqlite.open('./db/webcam.db');


const url = "https://www.something.com/.../image.jpg"

async function download() {
  const response = await fetch(url);
  const buffer = await response.buffer();
  fs.writeFile(`./image.jpg`, buffer, () => 
    console.log('finished downloading!'));
}


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var webcamRouter = require('./routes/webcam');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/webcam', webcamRouter);

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
