
var pendingCampaignsJS = [];
var activeCampaignsJS = [];
var completedCampaignsJS = [];

function CampaignListViewModel() {
	var self = this;

	self.pendinglist = ko.observableArray();
	self.activelist = ko.observableArray();
	self.completedlist = ko.observableArray();

	self.init = function () {
		pendingCampaignsJS = [];
		activeCampaignsJS = [];
		completedCampaignsJS = [];
		var input = { 
			'UserGUID' : getCookie('UserGUID')
		 };
		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/get_campaigns',
			xhrFields: { withCredentials: true },
	      data: JSON.stringify(input),
		}).done(function(data) {
		  	for(var i =0;i<data.length; i++){
		  		var input = { 
					'CampaignGUID' : data[i]
				 };
				$.ajax({
				  type: "POST",
			      contentType: "application/json",
			      url: '/api/get_campaign',
			      data: JSON.stringify(input),
				}).done(function(data) {
					if(data.Status == "Pending"){
						pendingCampaignsJS.push(data);
				  		self.pendinglist(pendingCampaignsJS);
					}
					else if(data.Status == "Active"){
						activeCampaignsJS.push(data);
				  		self.activelist(activeCampaignsJS);
					}			
					else {
						completedCampaignsJS.push(data);
				  		self.completedlist(completedCampaignsJS);
					}	  	
				});

		  	}
		});
	};

	self.openCampaign = function(campaign) {

		campaignVM.openExistingCampaign(campaign);
	};

	self.newCampaign = function () {
		campaignVM.newCampaign();
	};
}

function CampaignViewModel() {
	var self = this;

	self.campaignName = ko.observable('');

	self.canvassersAssigned = ko.observableArray();
	self.canvassersToPick = ko.observableArray();

	self.managersAssigned = ko.observableArray();
	self.managersToPick = ko.observableArray();

	self.locations = ko.observable('');

	self.questions = ko.observable('');

	self.startDate = ko.observable('');

	self.talkingPoints = ko.observable('');

	self.isEdit = ko.observable(true);

	self.init = function() {

		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/get_managers',
			xhrFields: { withCredentials: true }
		}).done(function(data) {
		  	self.managersToPick(data);
		});

		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/get_canvassers',
			xhrFields: { withCredentials: true }
		}).done(function(data) {
		  	self.canvassersToPick(data);
		});
	};

	self.newCampaign = function () {
		self.isEdit(true);
		campaignViewDialog.dialog("open");
	};

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
			for(var i = 0; i < self.managersAssigned().length; i++) {
				var input = {
					'ManagerGUID' : self.managersAssigned()[i],
					'CampaignGUID' : data
				}
			  	$.ajax({
				  type: "POST",
			      contentType: "application/json",
			      url: '/api/add_manager_to_campaign',
			      data: JSON.stringify(input),
					}).done(function(data) {
						if(getCookie('UserGUID') == input.ManagerGUID)
					  		campaignListVM.init();
					  	self.cancel();
					});;

			}
			
		});
	};

	self.openExistingCampaign = function (campaign) {
		
		self.isEdit(false);
		self.campaignName(campaign.Name);
		self.canvassersAssigned(campaign.Canvassers);
		self.managersAssigned(campaign.Managers);
		self.locations(campaign.Locations);
		self.questions(campaign.Questionnaire);
		self.startDate(campaign.Start);
		self.talkingPoints(campaign.Talking_points);

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

}

var campaignViewDialog = $("#campaign-view-modal").dialog({
  dialogClass: "campaign-view-dialog",
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
var campaignListVM = new CampaignListViewModel();
var campaignVM = new CampaignViewModel();
campaignListVM.init();
campaignVM.init();

ko.applyBindings(campaignListVM,$("#campaign-list")[0]);
ko.applyBindings(campaignVM,$("#campaign-view-modal")[0]);
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