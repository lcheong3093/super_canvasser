
var campaignsJS = [];

function CampaignListViewModel() {
	var self = this;

	self.list = ko.observableArray();

	self.init = function () {
		campaignsJS = [];
		var input = { 
			'UserGUID' : getCookie('UserGUID')
		 };
		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: 'http://localhost:8080/get_campaigns',
	      data: JSON.stringify(input),
		}).done(function(data) {
		  	for(var i =0;i<data.length; i++){
		  		var input = { 
					'CampaignGUID' : data[i]
				 };
				$.ajax({
				  type: "POST",
			      contentType: "application/json",
			      url: 'http://localhost:8080/get_campaign',
			      data: JSON.stringify(input),
				}).done(function(data) {
				  	campaignsJS.push(data);
				  	self.list(campaignsJS);
				});

		  	}
		});
	};

	self.openCampaign = function(campaign) {

		campaignVM.openExistingCampaign(campaign);
	}

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
			'Talking_points': self.talkingPoints()
		};
		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: 'http://localhost:8080/create_campaign',
	      data: JSON.stringify(input),
		}).done(function(data) {
			var input = {
				'ManagerGUID' : getCookie('UserGUID'),
				'CampaignGUID' : data
			}
		  	$.ajax({
			  type: "POST",
		      contentType: "application/json",
		      url: 'http://localhost:8080/add_manager_to_campaign',
		      data: JSON.stringify(input),
				}).done(function(data) {
				  	campaignListVM.init();
				  	self.cancel();
				});;
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
		campaignViewDialog.dialog("open");
		
	};

	self.cancel = function () {
		self.cleanModal();
		campaignViewDialog.dialog("close");
	};

	self.cleanModal = function () {
		self.isEdit(true);
		self.locations('');
		self.questions('');
		self.startDate('');
		self.talkingPoints('');
		self.campaignName('');
	};

}

var campaignViewDialog = $("#campaign-view-modal").dialog({
  dialogClass: "campaign-view-dialog",
  autoOpen: false,
  width: 500,
  height: 700,
});
var campaignListVM = new CampaignListViewModel();
var campaignVM = new CampaignViewModel();
campaignListVM.init();

ko.applyBindings(campaignListVM,$("#campaign-list")[0]);
ko.applyBindings(campaignVM,$("#campaign-view-modal")[0]);

$( document ).ready(function() {
    $("select").select2({
    	tags: true
    });

    var mymap = L.map('locations-map').setView([40.92, -73.13], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZGlub211ZnRpYyIsImEiOiJjam82aWRwdDgwNmc1M2tvM3Z6bjVybzdkIn0.2SdesRBzPBzAABi4xOAiFw', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiZGlub211ZnRpYyIsImEiOiJjam82aWRwdDgwNmc1M2tvM3Z6bjVybzdkIn0.2SdesRBzPBzAABi4xOAiFw'
}).addTo(mymap);
});