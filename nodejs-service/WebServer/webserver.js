var express = require('express');
var cookieSession = require('cookie-session')
//var app = express();
var webserverRouter = express.Router();

//router.use(express.static('public'));


webserverRouter.get('/', function (req, res) {
   res.sendFile( __dirname + "/public/" + "login.html" );
})

//Images
webserverRouter.get('/Images/logo.png', function (req, res) {
   res.sendFile( __dirname + "/public/Images/logo.png");
});

//Manager
webserverRouter.get('/Manager/Scripts/managerdashboard.js', function (req, res) {
   res.sendFile( __dirname + "/public/Manager/Scripts/managerdashboard.js");
});
webserverRouter.get('/Manager/Style/dashboard.css', function (req, res) {
   res.sendFile( __dirname + "/public/Manager/Style/dashboard.css");
});
webserverRouter.get('/Manager/Dashboard.html', function (req, res) {
   res.sendFile( __dirname + "/public/Manager/Dashboard.html");
});



module.exports = webserverRouter;