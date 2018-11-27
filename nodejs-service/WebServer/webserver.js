var express = require('express');
var cookieSession = require('cookie-session')
var webserverRouter = express.Router();

webserverRouter.get('/', function (req, res) {
	req.session = null;
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
	if(req.session && req.session.UserType == "Manager")
   		res.sendFile( __dirname + "/public/Manager/Dashboard.html");
   	else
   		res.redirect('/web'); 
});



module.exports = webserverRouter;