const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});

module.exports = {
    async add_user(req, res) {
        console.log("REGISTER:", req.body);

        var username = req.body.username;
        var email = req.body.email;
        var role = req.body.role;

        var valid = await validUsernameEmail(username, email, role);
        console.log("VALID:", valid);
        if(valid == true){
            var entity = {Email: req.body.email, Name: req.body.name, Password: req.body.password, Username: req.body.username};

            if(role == "Canvasser")
                entity.Availability = arrayToString(req.body.dates);
            var key = datastore.key({
                path:[role, null]
            });
    
            var insert = {key: key, data: entity};
            
            var resp = await datastore.save(insert);
            res.send({error: ""});
        }else{
            console.log("Username/Email already exists");
            res.send({error: "User already exists"});
        }
            
    },

    async all_users(req, res) {
        const roles = ["Canvasser", "Manager", "SystemAdmin"];

        var ret = {Canvasser: null, Manager: null, SystemAdmin: null}

        var query;
        var result;
        for(var i=0; i<roles.length; i++) {
            query = datastore.createQuery(roles[i]);
            result = await datastore.runQuery(query);
            ret[roles[i]] = result[0];
        }

        // console.log(ret);
        res.send(ret);
    },

    async edit_parameters(req, res) {
        const query = datastore.createQuery("Parameter");

        console.log(req.body);

        var parameter = await datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            var entity = entities[0];
            entity.Duration = req.body.duration;
            entity.Speed = req.body.speed;

            datastore.update(entity);
        });
        // parameter[0].Duration = req.body.duration;
        // parameter[0].Speed = req.body.speed;

        // var resp = await datastore.update(parameter[0]);
    }
}

/** HELPER FUNCTIONS **/
async function validUsernameEmail(username, email, role) {
    const query = datastore.createQuery(role);
    query.filter('Username', username);

    var result = await datastore.runQuery(query);
    if(result[0].length != 0){
        console.log("Username exists");
        return false;
    }
    
    query.filter('Email', email);
    result = await datastore.runQuery(query);
    if(result[0].length != 0){
        console.log("Email exists");
        return false;
    }
    
    return true;
}   

function arrayToString(array) {
    var ret = '';
    for(var i=0; i<array.length; i++) {
        if(i == 0){
            ret = ret + array[i];
        }else{
            ret = ret + "," + array[i];
        }
    }
}