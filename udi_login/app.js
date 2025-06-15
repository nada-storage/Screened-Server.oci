'use strict';
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//--var logger = require('morgan');

const dotenv_path = path.join(process.cwd(), './.env');
const dotenv = require('dotenv').config({
  path: dotenv_path
});
if (dotenv.error) throw dotenv.error;

const my_reqinfo = require("./my_reqinfo");
require('console-stamp')(console, { 
  format: ':date(yyyy/mm/dd HH:MM:ss.l)' 
} );

console.log("Program started \n\n");


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//--app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//------------------------------------------------------
// router
//------------------------------------------------------
const route_alive = require('./routes/alive');
const route_user_ins = require('./routes/user_ins');
const route_user_upd = require('./routes/user_upd');
const route_user_del = require('./routes/user_del');
const route_user_sel = require('./routes/user_sel');

app.use('/alive', route_alive);
app.use('/user/ins', route_user_ins);
app.use('/user/upd', route_user_upd);
app.use('/user/del', route_user_del);
app.use('/user/sel', route_user_sel);

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
  //res.status(err.status || 500);
  //res.render('error');

  let ret_status = err.status || 500;
  let EXT_data = my_reqinfo.get_req_url(req);
  let ret_data = {
    code: "app.ERROR-HANDLER()",
    value: -9999,
    value_ext1: ret_status,
    value_ext2: res.locals.message,
    EXT_data,
  };
  console.log("[ERROR-HANDLER]" + "%s\n", JSON.stringify(ret_data, null, 2));

  res.status(ret_status).json(res.locals);

});

console.log("Listening on port " + process.env.PORT + "\n\n");

module.exports = app;
