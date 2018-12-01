
var todayTasksJS = [];
var completedTasksJS = [];
var upcomingTasksJS = [];

function TaskListViewModel() {
	var self = this;

	self.todaylist = ko.observableArray();
	self.completedlist = ko.observableArray();
	self.upcomingList = ko.observableArray();

	self.init = function () {

		activeTasksJS = [];
		completedTasksJS = [];
		upcomingTasksJS = [];
		var todaysDate = new Date();
		todaysDateString = todaysDate.toDateString();
		
		$.ajax({
		  type: "POST",
	      contentType: "application/json",
	      url: '/api/get_assignments',
			xhrFields: { withCredentials: true }
		}).done(function(data) {
		  	data.forEach(function(assignment){
		  		var assignmentDate = new Date(assignment.Date);
		  		assignmentDateString = assignmentDate.toDateString();

		  		if(todaysDateString == assignmentDateString){
		  			//Todays Assignments
		  			todayTasksJS.push(ko.mapping.fromJS(assignment));
		  			self.todaylist(todayTasksJS);

		  		}
		  		else if(todaysDate<assignmentDate){
		  			//Upcoming Assignments
		  			upcomingTasksJS.push(ko.mapping.fromJS(assignment));
		  			self.upcomingList(upcomingTasksJS);

		  		}
		  		else {
		  			//Past Assignments
		  			completedTasksJS.push(ko.mapping.fromJS(assignment));
		  			self.completedlist(completedTasksJS);
		  		}


		  	});
		});
	};

	self.openTask = function (task) {
		$("#tasks-list").hide();
		$("#task-view").show();
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

ko.applyBindings(taskListVM,$("#tasks-list")[0]);
//ko.applyBindings(taskVM,$("#task-view-modal")[0]);

ko.applyBindings(availabilityListVM,$("#availability-editor-left")[0]);


var map;

$( document ).ready(function() {
    $("#dates-selector").multiDatesPicker({
		altField: '#availability-editor-input'
	});

	availabilityListVM.init();

	map = new google.maps.Map(document.getElementById('task-view-left'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 8
        });
});

function toggleTab(tab) {

	if(tab == 1){
		$("#tasks-list").show();
		$("#availability-editor").hide();
		$("#task-view").hide();

	}
	else if(tab == 2){
		$("#tasks-list").hide();
		$("#availability-editor").show();
		$("#task-view").hide();

	}
}
