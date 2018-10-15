var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var ConfigurationFactory = require('../configurations.js');

router.post('/api/auth', (req, res) => {

	var connection = mysql.createConnection(ConfigurationFactory.UsedConnection.MySQLConnection);

	con.connect(function(err){
	    if(err){
	       console.log('Error connecting to Database');
	       return;
	    } console.log('Connection established');
	});

	var sql = con.query('call P_AuthenticateUser(?, ?)', [req.body.email, req.body.password], function(err, result) { 
      	if (err) throw err; 
      	console.log(result); 


    });
    	
    con.end(function(err) {

	});

});

module.exports = router;

