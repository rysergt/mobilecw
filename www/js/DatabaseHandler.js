var db = null;

function connectDB() {
    db = window.openDatabase("MadDiscovery", 1.0, "Mad Discovery", 2000000);
    if (db != null) {
        console.log("CONNECT DATABASE OK");
    }
}

function createTable() {
    db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS TBLEvent(ID INTEGER PRIMARY KEY, EventName, EventLocation, EventDate, EventOrgName, EventEnd);");
        tx.executeSql("CREATE TABLE IF NOT EXISTS TBLReport(ID INTEGER PRIMARY KEY, eventid, content, FOREIGN KEY(eventid) REFERENCES TBLEvent(ID));");
    }, function(err) {
        console.log("CREATE TABLE ERROR " + err.code);
    }, function() {
        console.log("CREATE TABLE OK");
    });
}
function dropTable() {
    db.transaction(function(tx) {
        tx.executeSql("DROP TABLE TBLEvent");
    }, function(err) {
        console.log("DROP TABLE ERROR " + err.code);
    }, function() {
        console.log("DROP TABLE SUCCESSFULLY");
    });
}

function insertEvent(eventName, eventLocation, eventDate, eventOrgName, eventEnd,onSuccessful) {
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO TBLEvent(EventName, EventLocation, EventDate, EventOrgName, EventEnd) VALUES(?, ?, ?, ?, ?);",
                        [eventName, eventLocation, eventDate, eventOrgName, eventEnd]);
    }, function(err) {
        console.log("INSERT EVENT ERROR " + err.code);
    }, function() {
        onSuccessful();
    });
}

function insertReport(eventid, content,onSuccessfulReport) {
    db.transaction(function(tx) {
        tx.executeSql("INSERT INTO TBLReport(eventid, content) VALUES(?, ?);",
                        [eventid, content]);
    }, function(err) {
        console.log("INSERT REPORT ERROR " + err.code);
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
        console.log("GET LIST EVENT ERROR " + err.code);
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
        console.log("GET LIST EVENT BY NAME ERROR " + err.message);
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
        console.log("GET EVENT ERROR " + err.code);
    });
}

function getListReport(onSuccessfulReport) {
    db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM TBLReport;", [], function(tx, rs) {
            var numberOfEvent = rs.rows.length;
            var listEvents = [];
            for (var i = 0; i < numberOfEvent; i++) {
                listEvents.push({"ID": rs.rows.item(i).ID, "Event ID": rs.rows.item(i).eventid,
                "Content": rs.rows.item(i).content});
            }
            onSuccessfulReport(listReport);
        });
    }, function(err) {
        console.log("GET LIST EVENT ERROR " + err.code);
    });
}
function deleteEvent(eventID) {
    db.transaction(function(tx) {
        tx.executeSql("DELETE FROM TBLReport WHERE eventid = ?", [eventID]);
        tx.executeSql("DELETE FROM TBLEvent WHERE ID = ?", [eventID]);
    }, function(err) {
        console.log("DELETE EVENT ERROR " + err.code);
    }, function() {
        console.log("DELETE EVENT OK");
    });
}

function editEvent(eventName, eventLocation, eventDate, eventOrgName, eventEnd, eventID, onSuccessful) {
    db.transaction(function(tx) {
        tx.executeSql("UPDATE TBLEvent SET EventName = ?, EventLocation = ?, EventDate = ?, EventOrgName = ?, EventEnd= ?, EventReport= ? WHERE ID = ?",
        [eventName, eventLocation, eventDate, eventOrgName, eventEnd, eventID]);
    }, function(err) {
        console.log("EDIT EVENT ERROR " + err.code);
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
        console.log("SEARCH EVENT ERROR " + err.code);
    });
}
