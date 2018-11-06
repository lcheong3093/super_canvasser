var express = require('express');
var router = express.Router();

//Import files
const Auth = require('./Authentication');
const Manager = require('./Manager');
const Helpers = require('./Helpers');

//Connect to Datastore
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});

router.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
});

router.post('/login', (req, res) => {
    var role = req.body.role;
    var username = req.body.username;
    var password = req.body.password;

    Auth.login(username, password, role, function(err, result) {
        if(result.length == 0) {
            res.status(500).send("Incorrect password or username");
        }else{
            res.status(200).send(result[0]);
        }
    });
});

router.post('/create_user', (req, res) => {
    console.log(req.body);

});

/** CAVNASSER REQUESTS **/
router.post('/assignments', function(req, res){
    
});

router.post('/change_availability', (req, res) => {
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
router.post('/create_campaign', function(req, res){
    Manager.create_campaign(req.body, function(err, result){
        res.status(200).send(result);
    });
});
router.post('/get_campaigns', function(req, res){
    Manager.get_campaigns(req.body.UserGUID, function(err, result){
        res.status(200).send(result);
    });
    
});
router.post('/get_campaign', function(req, res){
    Manager.get_campaign(req.body.CampaignGUID, function(err, result){
        res.status(200).send(result);
    });
    
});
router.post('/get_canvassers', function(req, res){
    Manager.get_canvassers(function(err, result){
        res.status(200).send(result);
    });
    
});
router.post('/get_managers', function(req, res){
    Manager.get_managers(function(err, result){
        res.status(200).send(result);
    });
    
});
router.post('/add_manager_to_campaign', function(req, res){
    Manager.add_manager_to_campaign(req.body.ManagerGUID,req.body.CampaignGUID,function(err, result){
        res.status(200).send(result);
    });
    
});
module.exports = router;