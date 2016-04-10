var db = null;

function connectDB() {
    db = window.openDatabase("MadDiscovery", 1.0, "Mad Discovery", 2000000);
    if (db != null) {
        console.log("Create Database Successfully!");
    }
}

function createTable() {
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS TBLEvent(ID INTEGER PRIMARY KEY, EventName, EventLocation, EventDate, EventOrgName, EventEnd);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS TBLReport(ID INTEGER PRIMARY KEY, eventid, content, images, FOREIGN KEY(eventid) REFERENCES TBLEvent(ID));");
    }, function(err) {
        console.log("Create Tables Error: " + err.code);
    }, function() {
        console.log("Create Tables Successfully!");
    });
}
function dropTable() {
    db.transaction(function(tx) {
      tx.executeSql("DROP TABLE TBLReport");
        tx.executeSql("DROP TABLE TBLEvent");
    }, function(err) {
        console.log("Drop Table Event Error: " + err.code);
    }, function() {
        console.log("Drop Table Event Successfully!");
    });
}

function insertEvent(eventName, eventLocation, eventDate, eventOrgName, eventEnd,onSuccessful) {
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO TBLEvent(EventName, EventLocation, EventDate, EventOrgName, EventEnd) VALUES(?, ?, ?, ?, ?);",
                        [eventName, eventLocation, eventDate, eventOrgName, eventEnd]);
    }, function(err) {
        console.log("Insert Event Error: " + err.code);
    }, function() {
        onSuccessful();
    });
}

function insertReport(eventid, content,images,onSuccessfulReport) {
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO TBLReport(eventid, content,images) VALUES(?, ?,?);",
                        [eventid, content,images]);
    }, function(err) {
        console.log("Insert Report Error: " + err.code);
    }, function() {
        onSuccessfulReport();
    });
}

function getListEvent(onSuccessful) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM TBLEvent;", [], function(tx, rs) {
            var numberOfEvent = rs.rows.length;
            var listEvents = [];
            for (var i = 0; i < numberOfEvent; i++) {
                listEvents.push({"ID": rs.rows.item(i).ID, "EventName": rs.rows.item(i).EventName,
                "EventLocation": rs.rows.item(i).EventLocation, "EventDate": rs.rows.item(i).EventDate,
                 "EventOrgName": rs.rows.item(i).EventOrgName,"EventEnd": rs.rows.item(i).EventEnd});
            }
            onSuccessful(listEvents);
        });
    }, function(err) {
        console.log("Get List Events Error: " + err.code);
    });
}
function getListEventByName(eventName, onSuccessful) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM TBLEvent Where EventName like ?;", [eventName], function(tx, rs) {
            var numberOfEvent = rs.rows.length;
            var listEvents = [];
            for (var i = 0; i < numberOfEvent; i++) {
                listEvents.push({"ID": rs.rows.item(i).ID, "EventName": rs.rows.item(i).EventName,
                "EventLocation": rs.rows.item(i).EventLocation, "EventDate": rs.rows.item(i).EventDate,
                 "EventOrgName": rs.rows.item(i).EventOrgName,"EventEnd": rs.rows.item(i).EventEnd});
            }
            onSuccessful(listEvents);
        });
    }, function(err) {
        console.log("Get List Events By Name Error: " + err.message);
    });
}

function getEventByID(eventid, showDetail) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM TBLEvent Where ID = ?;", [eventid], function(tx, rs) {
            var numberOfEvent = rs.rows.length;
            var listEvents = [];
            for (var i = 0; i < numberOfEvent; i++) {
                listEvents.push({"ID": rs.rows.item(i).ID, "EventName": rs.rows.item(i).EventName,
                "EventLocation": rs.rows.item(i).EventLocation, "EventDate": rs.rows.item(i).EventDate,
                 "EventOrgName": rs.rows.item(i).EventOrgName,"EventEnd": rs.rows.item(i).EventEnd});
            }
            showDetail(listEvents);
        });
    }, function(err) {
        console.log("Get Event Error: " + err.code);
    });
}

function getListReport(eventID, onSuccessfulReport) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM TBLReport WHERE eventid = ?;", [eventID], function(tx, rs) {
            var numberOfEvent = rs.rows.length;
            var listReport = [];
            for (var i = 0; i < numberOfEvent; i++) {
                listReport.push({"ID": rs.rows.item(i).ID, "EventID": rs.rows.item(i).eventid,
                "Content": rs.rows.item(i).content, "Image":rs.rows.item(i).images});
            }
            onSuccessfulReport(listReport);
        });
    }, function(err) {
        console.log("Get List Reports Error: " + err.message);
    });
}
function deleteEvent(eventID) {
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM TBLReport WHERE eventid = ?", [eventID]);
        tx.executeSql("DELETE FROM TBLEvent WHERE ID = ?", [eventID]);
    }, function(err) {
        console.log("Delete Event Error: " + err.code);
    }, function() {
        console.log("Delete Event Successfully!");
    });
}

function editEvent(eventName, eventLocation, eventDate, eventOrgName, eventEnd, eventID, onSuccessful) {
    db.transaction(function(tx) {
        tx.executeSql("UPDATE TBLEvent SET EventName = ?, EventLocation = ?, EventDate = ?, EventOrgName = ?, EventEnd= ?, EventReport= ? WHERE ID = ?",
        [eventName, eventLocation, eventDate, eventOrgName, eventEnd, eventID]);
    }, function(err) {
        console.log("Edit Event Error: " + err.code);
    }, function() {
        onSuccessful();
    });
}

function searchEvent(eventID, onSuccessful) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM TBLEvent WHERE ID = ?", [eventID], function(tx, rs) {
            onSuccessful({"ID": rs.rows.item(0).ID, "EventName": rs.rows.item(0).EventName,
                            "EventLocation": rs.rows.item(0).EventLocation, "EventDate": rs.rows.item(0).EventDate,
                            "EventOrgName": rs.rows.item(0).EventOrgName});
        });
    }, function(err) {
        console.log("Search Event Error: " + err.code);
    });
}
