const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});

const Helpers = require('./Helpers');

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
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

        var key = datastore.key({
            path:["Campaign", null]
        });

        var insert = {key: key, data: entity};

        datastore.save(insert, function(err){
            if(err) throw err;

            callback(err,entity.CampaignGUID);
        });
    },
    get_campaigns: function(managerGUID,callback) {
        const query = datastore.createQuery("Manager");
        query.filter('UserGUID', managerGUID);
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;

            campaigns = entities[0].Campaigns.split(',');

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
    add_manager_to_campaign: function(managerGUID,campaignGUID,callback){
        const query = datastore.createQuery("Manager");
        query.filter('UserGUID', managerGUID);
        datastore.runQuery(query, function(err, entities) {
            if(err) throw err;
            console.log(entities);
            if(entities.length > 0){
                var campaigns = entities[0].Campaigns + ',' + campaignGUID;
                entities[0].Campaigns = campaigns;
                datastore.save(entities[0]);

                callback(err,"OK");
            }
            else {


            }

        });
    }

}