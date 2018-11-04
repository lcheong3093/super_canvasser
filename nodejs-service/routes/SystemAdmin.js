//Create instance of datastore service
const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});

module.exports{
    delete_user: function(user){
        user.id.delete();
    }

    create_user: function(user){

    }
}