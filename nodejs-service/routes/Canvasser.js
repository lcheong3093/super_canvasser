const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyB24uWl3butGDLy1v6GpDy44r6nBwidBVM'
});

const Helpers = require('./Helpers');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
    get_availability: function(userGUID,callback) {

        const query = datastore.createQuery("Canvasser");
        query.filter('CanvasserGUID', userGUID);
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            if(entities && entities.length>0)
                callback(null, entities[0].Availability);     
        });
         
    },
    change_availability: function(userGUID,dates,callback) {
        
        //Find specified canvasser
        const query = datastore.createQuery('Canvasser');
        query.filter('CanvasserGUID', userGUID);

        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            //Construct entity for update
            var entity = entities[0];
            entity.Availability = dates;

            datastore.update(entity, function(err, apiResponse){
                if(err) throw err;

                callback(null, apiResponse);   
            });
        });

    },
    get_assignments: function(userGUID,callback) {

        const query = datastore.createQuery("Assignment");
        query.filter('CanvasserGUID', userGUID);
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            if(entities && entities.length>0)
                callback(null, entities); 
            else
                callback(null,null);    
        });
         
    },

}