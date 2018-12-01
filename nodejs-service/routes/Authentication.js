
//Create instance of datastore service
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308"
});

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';

function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = {
    /** Check if provided username & password are in the database for the specified role.
     *  Return true if username & password are valid, otherwise, false.
     */
    login: function(username, password, role, callback) {
        //Construct a query for kind [role] and filter by username & password
        const query = datastore.createQuery(role);
        query.filter('Username', username);
        query.filter('Password', encrypt(password));

        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;
            callback(err, entities);
        });
    }
}