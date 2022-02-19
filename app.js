require('debug-trace')({
  always: true
})


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('morgan');
const bodyParser = require('body-parser');
require('./app/utils/mongo-connection');
const app = express();

app.use(cors())
app.use(helmet())
app.use(logger('dev'));
app.use(function(req, res, next){
  console.log(req.method, req.originalUrl)
  next()
})
app.use(bodyParser.json({
  verify: function (req, res, buf) {
    const url = req.originalUrl;
    if (url == "/webhook" && req.method == "POST") {
      req.raw_body = buf.toString()
    }
  }
}));

// app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("", require('./app/routes/webhooks'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(new Error(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(res.locals)
});

module.exports = app;
