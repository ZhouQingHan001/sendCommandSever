var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var superagent = require('superagent');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
// app.use('/users', users);

app.use('/', express.static(path.join(__dirname, 'public', "index.html")));

app.post('/*', function (req, res, next) {
  console.log(req.body);
  superagent
    .post('http://47.106.208.19:9998' + req.path)
    .set('cookie', req.headers.cookie|| null)
    .send(req.body)
    .end((error, response) => {
      if (error) {
        console.error('error', error);
        res.send({ code: '网关出错' });
      }else {
          res.send(response.body);
        }
    });
});

app.get('/*', function (req, res, next) {
  console.log(req.path, req.query);
  superagent
    .get('http://47.106.208.19:9998' + req.path)
    .set('cookie', req.headers.cookie || null)
    .query(req.query)
    .end((error, response) => {
      if (error) {
        console.error('error', error);
        res.send({ code: '网关出错' });
      } else {
        res.send(response.body);
      }
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
