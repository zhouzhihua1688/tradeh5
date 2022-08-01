var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// // add html engine for html page...
// app.engine('.html', require('ejs').renderFile);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json({limit: '20mb'}));
app.use(bodyParser.urlencoded({
    limit: '20mb',
    extended: true
}));
app.use(cookieParser());
app.use('*', (req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://appuat.99fund.com.cn:7081');
  // res.setHeader('Access-Control-Allow-Origin', '*');  // 这样会丢掉cookie
  res.setHeader('Access-Control-Allow-Origin', req.headers.host.replace(/(\:\d*)/g, ''));
  next();
})
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/tradeh5/newWap/', express.static(path.join(__dirname, 'public')));
// app.use('/mobileEC/wap/', express.static(path.join(__dirname, 'public/wap/')));
// app.use('/mobileEC/adviser/', express.static(path.join(__dirname, 'public/adviser/')));
app.use('/mobileEC/', express.static(path.join(__dirname, 'public/')));
app.use('/css/', express.static(path.join(__dirname, 'public/wap/css/')));
app.use('/js/', express.static(path.join(__dirname, 'public/wap/js/')));
app.use('/images/', express.static(path.join(__dirname, 'public/wap/images/')));
app.use('/activity-center/act-resources/pages/', express.static(path.join(__dirname, 'public/zips/')));  // 活动包测试添加20220524
require('./routes/index')(app);
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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
