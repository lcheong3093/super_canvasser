const Datastore = require('@google-cloud/datastore');
const kmeans = require('node-kmeans');

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

function getFirstAvailableDate(startDate,Availability){
    var startDateDate = new Date(startDate);

    var splitAvailiability = Availability.split(',');

    splitAvailiability.forEach(function(date) {

        var currentDate = new Date(date);

        if(currentDate>=startDateDate)
            return currentDate.toDateString();

    });

    var todaysDate = new Date();
    return todaysDate.toDateString();
}

function getLocationList(response,locationfull) {
    var toReturn = []

    for(var i = 0; i < locationfull.length; i++) {
        for(var j = 0; j<response.cluster.length; j++){
            if(locationfull[i].coordinates == response.cluster[j])
                toReturn.push(locationfull[i]);
        }
    }

    return toReturn;
}

module.exports = {
    create_campaign: function(campaign, callback) {
        var questionnaire = campaign.Questionnaire;
        var locations = campaign.Locations;

        var entity = campaign;
        entity.Locations = locations;
        entity.Questionnaire = questionnaire;
        entity.Name = campaign.Name;
        entity.CampaignGUID = uuidv4();
        entity.Start = campaign.Start;
        entity.Talking_points = campaign.Talking_points;
        entity.Managers = campaign.Managers;
        entity.Canvassers = campaign.Canvassers;
        
        var ToGeocode = locations.split(/\r?\n/);
        var coordinates = [];

        var encodedAddresses = 0;

        for (var i = 0; i < ToGeocode.length; i++) {
            
            googleMapsClient.geocode({
                  address: ToGeocode[i]
                }, function(err, response) {
                    encodedAddresses++;
                  if (!err) {
                    var responseGeo = response.json.results[0].geometry.location;
                    
                    coordinates.push({
                        'location': response.query.address,
                        'coordinates': [responseGeo.lat, responseGeo.lng]
                    });
                  }
                  else{
                    coordinates.push({
                        'location': response.query.address,
                        'coordinates': null
                    });
                  }
                
                    if(encodedAddresses == ToGeocode.length) {

                        entity.LocationsCoordinates = JSON.stringify(coordinates);

                        var key = datastore.key({
                            path:["Campaign", null]
                        });

                        var insert = {key: key, data: entity};

                        datastore.save(insert, function(err){
                            if(err) throw err;

                            callback(err,entity.CampaignGUID);
                        }) 

                    }
                }
            );
        }

    },
    update_campaign: function(campaign,callback) {
        
        const query = datastore.createQuery("Campaign");
        query.filter('CampaignGUID', campaign.CampaignGUID);
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            if(entities.length > 0){
                
                var questionnaire = campaign.Questionnaire;
                var locations = campaign.Locations;

                entities[0].Locations = locations;
                entities[0].Questionnaire = questionnaire;
                entities[0].Name = campaign.Name;
                entities[0].Start = campaign.Start;
                entities[0].Talking_points = campaign.Talking_points;
                entities[0].Managers = campaign.Managers;
                entities[0].Canvassers = campaign.Canvassers;

                var ToGeocode = locations.split(/\r?\n/);
                var coordinates = [];

                var encodedAddresses = 0;
            
                for (var i = 0; i < ToGeocode.length; i++) {
                    
                    googleMapsClient.geocode({
                          address: ToGeocode[i]
                        }, function(err, response) {
                            encodedAddresses++;
                          if (!err) {
                            var responseGeo = response.json.results[0].geometry.location;

                            coordinates.push({
                                'location': response.query.address,
                                'coordinates': [responseGeo.lat, responseGeo.lng]
                            });
                          }
                          else{
                            coordinates.push({
                                'location': response.query.address,
                                'coordinates': null
                            });
                          }
                            
                            if(encodedAddresses == ToGeocode.length) {

                                entities[0].LocationsCoordinates = JSON.stringify(coordinates);
                                
                                datastore.save(entities[0],function(err){
                                    if(err) throw err;

                                    callback(err,"OK");
                                });

                            }
                        }
                    );
                }

                

                
            }
            else {


            }    
        });   

    },
    get_campaigns: function(managerGUID,callback) {
        const query = datastore.createQuery("Campaign");
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            var campaigns = [];
            for(var i = 0; i<entities.length; i++){
                if(entities[i].Managers && entities[i].Managers.includes(managerGUID)){
                    campaigns.push(entities[i]);
                }
            }

            callback(null, campaigns);     
        });
         
    },
    get_campaign: function(campaignGUID,callback){
        const query = datastore.createQuery("Campaign");
        query.filter('CampaignGUID', campaignGUID);
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            callback(null, entities[0]);     
        });
    },
    get_canvassers: function(callback){
        const query = datastore.createQuery("Canvasser");
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            var canvasserList = [];

            for(var i = 0; i< entities.length; i++) {
                canvasserList.push({
                    'CanvasserName': entities[i].Name,
                    'CanvasserGUID': entities[i].CanvasserGUID
                });
            }

            callback(null, canvasserList);     
        });
    },
    get_managers: function(callback){
        const query = datastore.createQuery("Manager");
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            var managerList = [];

            for(var i = 0; i< entities.length; i++) {
                managerList.push({
                    'ManagerName': entities[i].Name,
                    'ManagerGUID': entities[i].UserGUID
                });
            }

            callback(null, managerList);     
        });
    }, 
    create_assignments: function(campaign, callback) {

        const query = datastore.createQuery("Campaign");
        query.filter('CampaignGUID',campaign.CampaignGUID);
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            var campaignInfo = entities[0];

            parsedLocationCoordinates = JSON.parse(campaignInfo.LocationsCoordinates);
            NumOfCanvassers = campaignInfo.Canvassers.length;
            CanvasserInfoLoaded = 0;
            CanvasserInfo = [];

            campaignInfo.Canvassers.forEach(function(canvasser){
                const query = datastore.createQuery("Canvasser");
                query.filter('CanvasserGUID', canvasser);
                datastore.runQuery(query, function(err, entities) {
                    if(err) throw err;

                    CanvasserInfoLoaded++;

                    CanvasserInfo.push({
                        'CanvasserName': entities[0].Name,
                        'CanvasserGUID': entities[0].CanvasserGUID,
                        'Availability': entities[0].Availability
                    });
                    

                    if(CanvasserInfoLoaded == NumOfCanvassers){
                        //All Canvassers Loaded

                        //Divide locations into number of canvassers
                        var vectors =[];
                        
                        for(var i = 0; i<parsedLocationCoordinates.length; i++) {
                            vectors.push(parsedLocationCoordinates[i].coordinates);
                        }
                        
                        kmeans.clusterize(vectors, {k: NumOfCanvassers}, (err,res) => {
                          if (err) console.error(err);

                          else {
                            
                            //Assign to each canvasser
                            var AssignmentsSaved = 0;


                            for(var i = 0; i< NumOfCanvassers; i++) {

                                if(res[i]) {
                                    var dateOfAssignment = getFirstAvailableDate(campaignInfo.Start,CanvasserInfo[i].Availability);
                                    var Locations = getLocationList(res[i],parsedLocationCoordinates);
                                    debugger;
                                    var entity = {
                                        'AssignmentGUID': uuidv4(),
                                        'CampaignGUID': campaign.CampaignGUID,
                                        'CampaignName': campaignInfo.Name,
                                        'CanvasserGUID': CanvasserInfo[i].CanvasserGUID,
                                        'Date': dateOfAssignment,
                                        'Locations': Locations
                                    };

                                    //Save asssignment
                                    var key = datastore.key({
                                        path:["Assignment", null]
                                    });

                                    var insert = {key: key, data: entity};

                                    datastore.save(insert, function(err){
                                        if(err) throw err;

                                        
                                       
                                    });
                                }

                                

                            }

                            campaignInfo.Status = "Active";

                            datastore.save(campaignInfo,function(err){
                                    if(err) throw err;

                                    callback(err,"OK");
                                });
                            

                          }
                        });

                    }

                });
            })

             
        });

    },

}