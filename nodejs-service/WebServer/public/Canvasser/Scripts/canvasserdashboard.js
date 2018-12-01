
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
			xhrFields: { withCredentials: true }
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

	self.editAvailiabilty = function () {
		editAvailabilityViewDialog.dialog('open');
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


	self.openTask = function (task) {
		
		self.campaignName(task.Name);
		self.locations(task.Locations);
		self.questions(task.Questionnaire);
		self.startDate(task.Start);
		self.talkingPoints(task.Talking_points);
		self.campaignGUID(task.CampaignGUID);

		if(campaign.LocationsCoordinates){
			var parsedLocations = JSON.parse(campaign.LocationsCoordinates);
			parsedLocations.forEach(function(location){

        		markersLayer.addLayer(L.marker(location)); 
				locationmap.setView(location);

			});
			
		}

		taskViewDialog.dialog("open");
		
	};

	self.init = function () {

	};
	
	self.cancel = function () {
		self.cleanModal();
		taskViewDialog.dialog("close");
	};

	self.cleanModal = function () {
		markersLayer.clearLayers();
		self.campaignGUID('');
		self.locations('');
		self.questions('');
		self.startDate('');
		self.talkingPoints('');
		self.campaignName('');
	};

}

var datesJS = [];
function AvailabilityListViewModel() {
	var self = this;

	self.availabilityList = ko.observableArray();

	self.init = function() {
		datesJS = [];
		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/get_availability',
			xhrFields: { withCredentials: true }
		}).done(function(data) {
		  	if(data) {
		  		var splitDates = data.split(',');

		  		splitDates.forEach(function(item){

		  			var itemToInsert = item.trim();
		  			
		  			$('#dates-selector').multiDatesPicker('addDates', itemToInsert);
		  			var dateParsed = new Date(itemToInsert);
		  			datesJS.push(dateParsed.toDateString());
		  			availabilityListVM.availabilityList(datesJS);
		  			
		  		});
		  	}
		});
	};

};

function saveAvailability() {
	var input = {
		'dates': $("#availability-editor-input").val()
	};
	$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/change_availability',
			xhrFields: { withCredentials: true },
			data: JSON.stringify(input)
		}).done(function(data) {
		  	availabilityListVM.init();
		  	
		});
}

var taskListVM = new TaskListViewModel();
var taskVM = new TaskViewModel();
var availabilityListVM = new AvailabilityListViewModel();

taskListVM.init();
taskVM.init();

//ko.applyBindings(taskListVM,$("#task-list")[0]);
//ko.applyBindings(taskVM,$("#task-view-modal")[0]);

ko.applyBindings(availabilityListVM,$("#availability-editor-left")[0]);



$( document ).ready(function() {
    $("#dates-selector").multiDatesPicker({
		altField: '#availability-editor-input'
	});

	availabilityListVM.init();
});

function toggleTab(tab) {

	if(tab == 1){
		$("#tasks-list").show();
		$("#availability-editor").hide();
	}
	else if(tab == 2){
		$("#tasks-list").hide();
		$("#availability-editor").show();
	}
}
