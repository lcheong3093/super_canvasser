var express = require('express');
var router = express.Router();


// const Auth = require('./Authentication');

//
const SystemAdmin = require('./SystemAdmin');

router.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
});

router.post('/add_user', SystemAdmin.add_user);
router.get('/users', SystemAdmin.all_users);
router.post('/edit_parameters', SystemAdmin.edit_parameters);

module.exports = router;