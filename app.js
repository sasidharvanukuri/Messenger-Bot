;`use strict`;

require('debug-trace')({
  always: true
})

const Dotenv = require('dotenv')
Dotenv.config({ silent: true })

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');

// ! Mongo database connection
require('./app/utils/mongo-connection')
require('./app/utils/models-loader');
const app = express();

app.use(cors())
app.use(helmet())

// Refer - morgan documentation
logger.token("date", function (req) {
  return new Date().toISOString().replace("Z", "")
})

app.use(logger(':date: :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" [:response-time ms]'));

/**
 * Custome middleware 
 * @description To test incoming request object
 * For debugging and etc.
 */
app.use(function(req, res, next){
  // console.log(req.method, req.originalUrl)
  next()
})

/**
 * @function Rawbody Middleware
 * ! For Signature verification - Even bit alteration can give side effects
 * In typical - we use JSON data parsers for development
 * But it changes incomming data to JS object
 * 
 * @description To handle and store buffer data for signature verfication
 * 
 */
app.use(bodyParser.json({
  verify: function (req, res, buf) {
    const url = req.originalUrl;
    if (url == "/webhook" && req.method == "POST") {
      req.raw_body = buf.toString()
    }
  }
}));

app.use(express.urlencoded({ extended: true }));

// ! ALL the routes goes here
//*--------------------------------------------------------------------------------
app.use("", require('./app/routes/webhooks'));
app.use("", require('./app/routes/messages'));
//*--------------------------------------------------------------------------------

// ! catch 404 and forward to error handler
// This is interesting middleware 
app.use(function (req, res, next) {
  let err = new Error("Not Found")
  err.status = 404
  next(err);
});

// ! Application Error Handler
// * Global Type errors, function handling error
// ? not promise exception
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send()
});

module.exports = app;
