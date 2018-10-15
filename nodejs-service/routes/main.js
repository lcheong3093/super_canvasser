var express = require('express');
var router = express.Router();

const Auth = require('./Authentication');

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

    const query = datastore.createQuery(role);
    query.filter('Username', username);
    query.filter('Password', password);

    datastore.runQuery(query, function(err, entities) {
        if(err) throw err;
        
        res.send({result:entities});
    });
    // console.log(Auth.login(username, password, role));
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

    var insert = dates[0];
    for(var i=1; i<dates.length; i++)
        insert += ", " + dates[i];
    console.log(insert);

    const query = datastore.createQuery('Canvasser');
    query.filter('Username', user);

    datastore.runQuery(query, function(err, entities) {
        if(err) throw err;

        var entity = entities[0];
        entity.Availability = insert;
        console.log(entity);

        datastore.update(entity, function(err, apiResponse){
            if(err) throw err;
        });
    });

    res.send({status: 'OK'});
});



module.exports = router;