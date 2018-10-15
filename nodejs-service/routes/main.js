var express = require('express');
var router = express.Router();

const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});


router.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
});

router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
});

router.post('/create_user', (req, res) => {
    console.log(req.body);

});

/** CAVNASSER REQUESTS **/
router.post('/assignments', function(req, res){
    var name = req.body.name;
    var role = req.body.role;

    const query = datastore.createQuery(role);
    query.filter('Name', name);
    datastore.runQuery(query, function(err, entities) {
        if(err) throw err;
        console.log(entities);
        res.send({ results: entities })
    });
});

router.post('/change_availability', (req, res) =>{
    var dates = req.body.dates;
});



module.exports = router;