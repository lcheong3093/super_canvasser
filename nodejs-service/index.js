var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

var main = require('./routes/main');

app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', main);

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

var fs = require('fs'),
    http = require('http');

http.createServer(function (req, res) {
  var path = '.' + req.url;

  // Default to index.html if no file is specified.
  if (req.url.split('.').length === 1) {
    path += (req.url[req.url.length - 1] !== '/' ? '/' : '') + 'login.html';
  }

  // Check if resource exists and serve 404 page if it doesn't.
  fs.exists(path, function (exists) {
    if ( ! exists) {
      path = './Pages/404.html';
    }
 
    fs.readFile(path, function (err, html) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(html + '');  
      res.end();
    });
   
    
  });
})
.listen(3000, '127.0.0.1');