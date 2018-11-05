//Create instance of datastore service
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});

module.exports = {
    delete_user: function(username, role, callback){
        const query = datastore.createQuery(role);
        query.filter('Username', username);
        dataStore.delete(username);
    },

    create_user: function(user, role, callback) {
        var name = user.Name;
        var username = user.Username;
        var password = user.Password;
        var email = user.Email;

        var entity = user;
        entity.Name = name;
        entity.Username = username;
        entity.Password = password;
        entity.Email = email;

        var key = datastore.key({
            path:[role, null]
        });

        var insert = {key: key, data: entity};

        datastore.save(insert, function(err){
            if(err) throw err;
            callback(err, entity);
        });
    }
}