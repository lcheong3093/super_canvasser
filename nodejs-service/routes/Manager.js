const Datastore = require('@google-cloud/datastore');
const datastore = new Datastore({
    projectId: "super-canvasser-cse308",
});

const Helpers = require('./Helpers');

module.exports = {
    create_campaign: function(campaign, callback) {
        var questionnaire = Helpers.arrayToString(campaign.Questionnaire);
        var locations = Helpers.arrayToString(campaign.Locations);

        var entity = campaign;
        entity.Locations = locations;
        entity.Questionnaire = questionnaire;

        var key = datastore.key({
            path:["Campaign", null]
        });

        var insert = {key: key, data: entity};

        datastore.save(insert, function(err){
            if(err) throw err;
            callback(err, entity);
        });
    }
}