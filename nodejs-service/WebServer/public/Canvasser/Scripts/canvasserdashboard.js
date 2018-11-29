
var activeTasksJS = [];
var completedTasksJS = [];

function TaskListViewModel() {
	var self = this;

	self.activelist = ko.observableArray();
	self.completedlist = ko.observableArray();

	self.init = function () {

		activeCampaignsJS = [];
		completedCampaignsJS = [];
		
		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/get_tasks',
			xhrFields: { withCredentials: true },
	      data: JSON.stringify(input),
		}).done(function(data) {
		  	for(var i =0;i<data.length; i++){

		  		if(data[i].Status == "Active"){
					activeCampaignsJS.push(data[i]);
			  		self.activelist(activeCampaignsJS);
				}			
				else {
					completedCampaignsJS.push(data[i]);
			  		self.completedlist(completedCampaignsJS);
				}	

		  	}
		});
	};

}


function TaskViewModel() {
	var self = this;

	self.campaignGUID = ko.observable('');
	self.campaignName = ko.observable('');

	self.locations = ko.observable('');

	self.questions = ko.observable('');

	self.startDate = ko.observable('');

	self.talkingPoints = ko.observable('');


	self.saveCampaign = function () {
		var input = {
			'Questionnaire': self.questions(),
			'Locations': self.locations(),
			'Name': self.campaignName(),
			'Start': self.startDate(),
			'Talking_points': self.talkingPoints(),
			'Managers': self.managersAssigned(),
			'Canvassers': self.canvassersAssigned(),
			'Status': 'Pending'
		};
		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/create_campaign',
	      data: JSON.stringify(input),
		}).done(function(data) {
			campaignListVM.init();
			self.cancel();
			
		});
	};

	self.updateCampaign = function () {
		var input = {
			'Questionnaire': self.questions(),
			'Locations': self.locations(),
			'Name': self.campaignName(),
			'Start': self.startDate(),
			'Talking_points': self.talkingPoints(),
			'Managers': self.managersAssigned(),
			'Canvassers': self.canvassersAssigned(),
			'CampaignGUID': self.campaignGUID()
		};
		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/update_campaign',
	      data: JSON.stringify(input),
		}).done(function(data) {
			campaignListVM.init();
			self.cancel();
			
		});
	};

	self.openExistingCampaign = function (campaign) {
		
		self.isEdit(false);
		self.isNew(false);
		self.campaignName(campaign.Name);
		self.canvassersAssigned(campaign.Canvassers);
		self.managersAssigned(campaign.Managers);
		self.locations(campaign.Locations);
		self.questions(campaign.Questionnaire);
		self.startDate(campaign.Start);
		self.talkingPoints(campaign.Talking_points);
		self.campaignGUID(campaign.CampaignGUID);

		self.canvasserNameList(getStringListOfCanvassers(campaign.Canvassers));
		self.managerNameList(getStringListOfManagers(campaign.Managers));

		$("#canvasser-select").val(campaign.Canvassers).trigger('change');
		$("#manager-select").val(campaign.Managers).trigger('change');

		if(campaign.LocationsCoordinates){
			var parsedLocations = JSON.parse(campaign.LocationsCoordinates);
			parsedLocations.forEach(function(location){

        		markersLayer.addLayer(L.marker(location)); 
				locationmap.setView(location);

			});
			
		}

		campaignViewDialog.dialog("open");
		
	};

	self.cancel = function () {
		self.cleanModal();
		campaignViewDialog.dialog("close");
	};

	self.cleanModal = function () {
		markersLayer.clearLayers();
		self.isEdit(true);
		self.isNew(true);
		self.campaignGUID('');
		self.locations('');
		self.questions('');
		self.startDate('');
		self.talkingPoints('');
		self.campaignName('');
		self.canvassersAssigned([]);
		self.managersAssigned([]);

		$("#canvasser-select").val('').trigger('change');
		$("#manager-select").val('').trigger('change');

	};

	self.editCampaign = function () {
		self.isEdit(true);
	};

}

var taskViewDialog = $("#task-view-modal").dialog({
  dialogClass: "task-view-dialog",
  autoOpen: false,
  width: 500,
  height: 700,
  open: function () {
        //Adds blacked out overlay
        $('body').prepend('<div class="ui-widget-overlay ui-front"></div>');
        locationmap.invalidateSize();
    },
    close: function () {
        $('body').find('.ui-widget-overlay.ui-front').remove();
    }
});
var taskListVM = new TaskListViewModel();
var taskVM = new TaskViewModel();
taskListVM.init();
taskVM.init();

ko.applyBindings(taskListVM,$("#task-list")[0]);
ko.applyBindings(taskVM,$("#task-view-modal")[0]);
var locationmap;
var markersLayer;
var mapmarkers = [];
$( document ).ready(function() {
    $("select").select2({
    	tags: true
    });
    var layer = new L.StamenTileLayer("toner");
    markersLayer = new L.LayerGroup();
	locationmap = new L.Map("locations-map", {
    	center: new L.LatLng(37.7, -122.4),
    	zoom: 12
	});
	locationmap.addLayer(layer);
    markersLayer.addTo(locationmap);
});