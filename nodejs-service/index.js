var cookieSession = require('cookie-session');
var express = require('express');
var cookieParser = require('cookie-parser');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var main = require('./routes/main');
var webserver = require('./WebServer/webserver')

app.use(cookieParser('bakaizet'));
app.use(cookieSession({
  name: 'session',
  secret: 'bakaizet',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.set('trust proxy', 1) 

app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api', main);
app.use('/web', webserver);

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
  res.send(err);
});

if (module === require.main) {
  // [START server]
  // Start the server
  const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
  // [END server]
}

module.exports = app;
