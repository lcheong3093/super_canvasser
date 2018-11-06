
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

	self.init = function() {


	};

	self.newCampaign = function () {
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


	self.cancel = function () {
		self.cleanModal();
		campaignViewDialog.dialog("close");
	};

	self.cleanModal = function () {
		
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
    $("select").select2();
});