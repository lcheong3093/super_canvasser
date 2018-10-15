var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send('Hello, world!');
});

router.get('/login.html',function(req,res){
       
     res.sendFile('/Pages/login.html');

});

module.exports = router;