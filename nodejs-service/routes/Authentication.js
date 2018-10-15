
// const Datastore = require('@google-cloud/datastore');
// const datastore = new Datastore({
//     projectId: "super-canvasser-cse308",
// });

// module.exports = {//Create instance of datastore service

//     /** Check if provided username & password are in the database for the specified role.
//      *  Return true if username & password are valid, otherwise, false.
//      */
//     function login(username, password, role) {
//         console.log(username, password, role);
//         //Construct a query for kind [role] and filter by username & password
//         const query = datastore.createQuery(role);
//         query.filter('Username', username);
//         query.filter('Password', password);

//         datastore.runQuery(query, function(err, entities) {
//             if(err) throw err;
            
//             return entities;
//         });
//     }
// }