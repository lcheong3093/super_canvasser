
//Create instance of datastore service
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});

module.exports = {
    /** Check if provided username & password are in the database for the specified role.
     *  Return true if username & password are valid, otherwise, false.
     */
    login: function(username, password, role, callback) {
        //Construct a query for kind [role] and filter by username & password
        const query = datastore.createQuery(role);
        query.filter('Username', username);
        query.filter('Password', password);

        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;
            console.log(entities);
            callback(err, entities);
        });
    },

    create_user: function(user, callback) {

    }
}