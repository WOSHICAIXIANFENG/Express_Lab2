var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');
var validator = require('express-validator');
var lessMiddleware = require('less-middleware');

var index = require('./routes/index');
var newsletter = require('./routes/newletter');

// for all request add csrf validation
let csurf = require('csurf');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.json());
//application/x-www-form-urlencoded is the default mime-type of your request
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }} // !!!! if here I set cookie: { secure: true} ---- all post request will block. server response 403
));
/**
 * https://github.com/expressjs/session
 * Please note that secure: true is a recommended option. However, it requires an https-enabled website, i.e.,
 * HTTPS is necessary for secure cookies. If secure is set, and you access your site over HTTP, the cookie will not be set.
 * If you have your node.js behind a proxy and are using secure: true, you need to set "trust proxy" in express:
 */

app.use(validator());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(csurf());
app.use(function(request, response, next){
    response.locals.csrftoken = request.csrfToken();
    console.log("Samuel Test csrftoken = " + request.csrfToken());
    next();
});

app.use('/', index);
app.use('/newsletter', newsletter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

app.listen(4000);
console.log('Start Application111');
