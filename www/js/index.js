var app = {
  initialize: function() {
    this.bindEvents();
  },
  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  onDeviceReady: function() {
    console.log('App is ready!');
    //dropTable();
    connectDB();
    createTable();
  },
};

window.addEventListener('push', function() {
  var p = window.location.pathname.split("/");
  console.log(p[p.length-1]);
  switch (p[p.length-1]) {
    case "index.html":
      loadIndex();
      break;
    case "detail.html":
      loadDetail();
      break;
    case "new-event.html":
      clearText();
      loadNewEvent();
      break;
    case "search.html":
      loadSearch();
      break;
    default:
      break;
  }

});

function loadDetail() {
  console.log("detail loaded");
  var currentEventID = getEventIdSelected();
  getEventByID(getEventIdSelected(), showDetail);
  getListReport(currentEventID, onSuccessfulReport);
  var imageCaptured= "";

  $('#save-report').on('touchstart', function() {
    console.log($("#txtContent").val());
    insertReport(currentEventID,$("#txtContent").val(), imageCaptured, function(){
      getListReport(currentEventID, onSuccessfulReport);
      $("#txtContent").val("");
    });
    console.log('Add Report Succesfully!');
  })
  $("#delete-event").on("touchstart", function(){
    confirmDelete();
    window.location = "index.html";
  })
}

function loadIndex() {
  app.initialize();
  connectDB();
  getListEvent(onSuccessful);
}

function loadSearch() {
  console.log("search loaded");
  $('#btnSearch').on('touchstart', function() {
    console.log("Searched Event Succesfully!");
    getListEventByName("%"+$("#inputSearch").val()+"%", onSuccessful);
  })
}

function loadNewEvent() {
  console.log("loaded event");
  $('#save-event').on('touchstart', function() {
    register();
    console.log('Add Event Succesfully!');
  })

  function register() {
    connectDB();
    var txtEventName = document.getElementById("txtEventName");
    var txtEventLocation = document.getElementById("txtEventLocation");
    var txtEventDate = document.getElementById("txtEventDate");
    var txtEventDateTime = document.getElementById("txtEventDateTime");
    var txtEventOrgName = document.getElementById("txtEventOrgName");
    var txtEventEnd = document.getElementById("txtEventEnd");
    var txtEventEndTime = document.getElementById("txtEventEndTime");

    var datestart = txtEventDate.value + "at" + txtEventDateTime.value;
    var datesend = txtEventEnd.value + "at" + txtEventEndTime.value;
    if (txtEventName.value != "" && txtEventOrgName.value != "") {
      insertEvent(txtEventName.value, txtEventLocation.value, datestart, txtEventOrgName.value, datesend,
        function() {
          console.log("Add Event Succesfully!");
          console.log(datestart);
        });
    } else {
      alert("Name and Organizer can't be blank!");
    }
  }
}

function clearText() {
  var dcc = new DateTime();
  var d = new Date();
  var txtEventName = document.getElementById("txtEventName");
  var txtEventLocation = document.getElementById("txtEventLocation");
  var txtEventDate = document.getElementById("txtEventDate");
  var txtEventDateTime = document.getElementById("txtEventDateTime");
  var txtEventOrgName = document.getElementById("txtEventOrgName");
  var txtEventEnd = document.getElementById("txtEventEnd");
  var txtEventEndTime = document.getElementById("txtEventEndTime");
  txtEventName.value = "";
  txtEventLocation.value = "";
  txtEventDate.value = dcc.formats.constants.w3c2;
  txtEventDateTime.value = dcc.formats.constants.w3c3;
  txtEventOrgName.value = "";
  txtEventEnd.value = dcc.formats.constants.w3c2;
  txtEventEndTime.value = dcc.formats.constants.w3c3;
}

function setEventIdSlected(id) {
  console.log("dfdf " + id);
  window.localStorage.setItem("eventSelected", id);
  console.log("td" + getEventIdSelected());
};

function getEventIdSelected() {
  return window.localStorage.getItem("eventSelected");
}

function showDetail(listEvents) {
  var txtEventName = document.getElementById("txtEventName");
  var txtEventLocation = document.getElementById("txtEventLocation");
  var txtEventDate = document.getElementById("txtEventDate");
  var txtEventDateTime = document.getElementById("txtEventDateTime");
  var txtEventOrgName = document.getElementById("txtEventOrgName");
  var txtEventEnd = document.getElementById("txtEventEnd");
  var txtEventEndTime = document.getElementById("txtEventEndTime");

  txtEventName.value = listEvents[0]["EventName"];
  txtEventLocation.value = listEvents[0]["EventLocation"];
  txtEventOrgName.value = listEvents[0]["EventOrgName"];
  txtEventDate.value = listEvents[0]["EventDate"].substring(0, 10);
  txtEventDateTime.value = listEvents[0]["EventDate"].substring(12, 17);
  txtEventEnd.value = listEvents[0]["EventEnd"].substring(0, 10);
  txtEventEndTime.value = listEvents[0]["EventEnd"].substring(12, 17);

  console.log("Name " + listEvents[0]["EventDate"].substring(12, 17));
}

function removeReport(id){
  var rs = confirm("Confirm deletion?");
  if (rs) {
    $("#r"+id).hide();
    deleteReport(id);
  }
}
function confirmDelete() {
  var rs = confirm("Confirm deletion?");
  if (rs) {
    deleteEvent(getEventIdSelected());
  }
}

function onSuccessful(listEvents) {
  var listEvent = document.getElementById("list-event");
  var numberOfEvent = listEvents.length;
  var listEventItem = "";
  if (numberOfEvent == 0) {
    listEventItem = "<h3 class='no-events'>No Events</h3>";
  }
  // loop for list events
  for (var i = 0; i < numberOfEvent; i++) {
    var id = listEvents[i]["ID"];
    var name = listEvents[i]["EventName"];
    var location = listEvents[i]["EventLocation"];
    var date = listEvents[i]["EventDate"].substring(8, 10);
    var res = listEvents[i]["EventDate"].substring(5, 7);
    var month = mymonth[parseInt(res - 1)];
    if (typeof month === 'undefined') {} else {
      month = mymonth[parseInt(res - 1)].substring(0, 3);
    }
    console.log(listEvents[i]["EventDate"]);
    listEventItem += "<li class='table-view-cell media'><a class='navigate-right' href='detail.html' data-transition='slide-in' id=" + id + "><div class='media-object pull-left'><div class='row date'>" + date + "</div><div class='row month'>" + month + "</div></div><div class='media-body'>" + name + "<p><i class='fa fa-map-marker'></i> " + location + "</p></div></a></li>";
  }
  $("#list-event").html(listEventItem);
  for (var i = 0; i < numberOfEvent; i++) {
    var id = listEvents[i]["ID"];
    document.getElementById(id).addEventListener("touchstart", function() {
      setEventIdSlected(this.id);
    });
  }
}
function onSuccessfulReport(listReport) {
  var numberOfReport = listReport.length;
  var listReportItem = "";
  if (numberOfReport == 0) {
    listEventItem = "<h3 class='no-events'>No report</h3>";
  }
  // loop for list events
  for (var i = 0; i < numberOfReport; i++) {
    var id = listReport[i]["ID"];
    var eventID = listReport[i]["EventID"];
    var content = listReport[i]["Content"];
    var images = listReport[i]["Image"];
    listReportItem += "<li class='table-view-cell media' id='r"+id+"'  onclick='removeReport("+id+")'><a class='navigate-right'><img class='media-object pull-left' src='"+images+"'><div class='media-body'><p>"+content+"</p></div></a></li>";
  }

  $("#list-report").html(listReportItem);
}

//take photo
function capture(){
  navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
      destinationType: Camera.DestinationType.FILE_URI });
}

function onSuccess(imageURI) {
    var image = document.getElementById('myImage');
    image.src = imageURI;
}

function onFail(message) {
    alert('Failed because: ' + message);
}
