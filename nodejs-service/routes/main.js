var express = require('express');
var cookieSession = require('cookie-session');
var mainRouter = express.Router();

//Import files
const Auth = require('./Authentication');
const Manager = require('./Manager');
const Helpers = require('./Helpers');
const SystemAdmin = require('./SystemAdmin')

//Connect to Datastore
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});


mainRouter.post('/login', (req, res) => {
    var role = req.body.role;
    var username = req.body.username;
    var password = req.body.password;

    Auth.login(username, password, role, function(err, result) {
        if(result.length == 0) {
            res.status(500).send("Incorrect password or username");
        } else{

              req.session.Email = result[0].Email;
              req.session.Name = result[0].Name;
              req.session.UserGUID = result[0].UserGUID;
              req.session.Username = result[0].Username;
              req.session.UserType = role;

                res.status(200).send(req.session);
        }
    });
});

/** SYSTEM ADMIN **/
mainRouter.post('/create_user', (req, res) => {
   console.log(req.body);
    SystemAdmin.create_user(req.body.user, req.body.Role, function(err, result) {
            res.status(200).send("Success");
    });

});

mainRouter.post('/delete_user', (req, res) => {
    console.log(req.body);
     SystemAdmin.delete_user(req.body.username, req.body.Role, function(err, result) {
             res.status(200).send("Success");
     });
 
 });

/** CAVNASSER REQUESTS **/
mainRouter.post('/assignments', function(req, res){
    
});

mainRouter.post('/change_availability', (req, res) => {
    var dates = req.body.dates;
    var user = req.body.username;

    //Convert array to string to store into Datastore
    var insert = dates[0];
    for(var i=1; i<dates.length; i++)
        insert += ", " + dates[i];

    //Find specified canvasser
    const query = datastore.createQuery('Canvasser');
    query.filter('Username', user);

    datastore.runQuery(query, function(err, entities) {
        if(err) throw err;

        //Construct entity for update
        var entity = entities[0];
        entity.Availability = insert;

        datastore.update(entity, function(err, apiResponse){
            if(err) throw err;
        });
    });

    res.send({status: 'OK'});
});

/** CAMPAIGN MANAGER REQUESTS **/
mainRouter.post('/create_campaign', function(req, res){
    if(req.session && req.session.UserType == "Manager")
    {
        Manager.create_campaign(req.body, function(err, result){
            res.status(200).send(result);
        });
    }
    else 
        res.status(401).send("Unauthorized");
    
});
mainRouter.post('/update_campaign', function(req, res){
    if(req.session && req.session.UserType == "Manager")
    {
        Manager.update_campaign(req.body, function(err, result){
            res.status(200).send(result);
        });
    }
    else 
        res.status(401).send("Unauthorized");
});
mainRouter.post('/get_campaigns', function(req, res){
    if(req.session && req.session.UserType == "Manager"){
        Manager.get_campaigns(req.session.UserGUID, function(err, result){
            res.status(200).send(result);
        });
    }
    else 
        res.status(401).send("Unauthorized");

});
mainRouter.post('/get_campaign', function(req, res){
    if(req.session) {
        Manager.get_campaign(req.body.CampaignGUID, function(err, result){
            res.status(200).send(result);
        });
    }
    else 
        res.status(401).send("Unauthorized");
    
});
mainRouter.post('/get_canvassers', function(req, res){
    if(req.session) {
        Manager.get_canvassers(function(err, result){
            res.status(200).send(result);
        });
    }
    else 
        res.status(401).send("Unauthorized");
    
});
mainRouter.post('/get_managers', function(req, res){
    if(req.session) {
        Manager.get_managers(function(err, result){
            res.status(200).send(result);
        });
    }
    else
        res.status(401).send("Unauthorized");
    
});
module.exports = mainRouter;