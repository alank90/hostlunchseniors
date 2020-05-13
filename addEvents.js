// ****************************** Function addEvents() *************************************** //

function addEvents() {
  // This function creates Google Calendar events from SS entries into the appropriate
  // Google Calendar and then retrieves the newly created event's ID and inserts them back
  // into the SS for use later in the onEdit() function. Note: It is assumed the Google
  // calendar ID's are in the SS at the start. 
  
  // ================================================================================================ //
  // ================================================================================================ //

  // Important!!! - This function is deprecated! See addRow() does the task of adding a calendar event 
  // from SS via user input of ropw to be added.

  // Initialize Variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var calendarId = "scarsdaleschools.org_4mlv8k2irsd7ina5bq3o65i4i8@group.calendar.google.com";

  var schedules = spreadsheet.getRange("A2:E3").getValues(); // The pertinent portion of the SS
  var lastColumn = spreadsheet.getLastColumn();

  // Iterate thru every row in SS to create Calendar Events
  for (x = 0; x < schedules.length; x++) {
    var games = schedules[x]; // get a whole row from schedules array
    // var calendarId = games[5]; // note: schedules index starts @ 4(because got range("C4:H10), so games[4] => games[8]
    var eventCal = CalendarApp.getCalendarById(calendarId); // get row's associated Google Calendar

    var title = games[0]; // assign event title
    var teacherName = games[1]; // assign current row's "Activity" cell value
    var startTime = games[2]; // assign current row's "Start Time" cell value
    var endTime = games[3];
    var description = games[4];
    

    var event = {
          description: description
    };

    // Create a calendar event from one row's data.
    // See https://developers.google.com/apps-script/reference/calendar/calendar#createEvent(String,Date,Date,Object)
    eventCal.createEvent(title, startTime, endTime, event);

    // Go back to top of loop and repeat for next SS's row of data
  } // End schedules[] loop. Now we have all Calendar Event's created in their respective calendar.

  // We will now add the calendar eventID's for each row back into the SS by retrieving
  // the just created Calendar event and reading it's ID.
  for (x = 0; x < schedules.length; x++) {
    // First set all values necessary for operation to retrieve and insert the eventID from calendar to SS
    var games = schedules[x]; // Again get a row from the schedules array representing one row in Active Sheet
    // var calendarId = games[5]; // Retrieve the calendarID from SS. This is hardcoded in SS.
    var calendar = CalendarApp.getCalendarById(calendarId);
    var startTime = games[2];
    var endTime = games[3];

    // Now retrieve all event objects in this row's given time range using row's info. See
    // https://developers.google.com/apps-script/reference/calendar/calendar-app#geteventsstarttime,-endtime
    var events = calendar.getEvents(startTime, endTime);

    var rowIndexOffset = x + 2; // Data for row's are offset by 1 down in the SS

    for (var i = 0; i < events.length; i++) {
      // For all events in given time range do:
      var ev = events[i]; // Get event from array

      // Store the eventID for given row using getId()
      // https://developers.google.com/apps-script/reference/calendar/calendar-event#getid
      var eventID = ev.getId();

      // Finally, set the calendarEventID value in the appropriate SS cell.
      spreadsheet.getRange(rowIndexOffset, lastColumn).setValue(eventID);
    } // end inner for loop
  } // end outer for loop
   
  
  // Now do some grooming of SS. Hilite the columns that correspond to Calendar event fields. Add a legend to bottom
  // of SS. And auto size the columns.
  var highlightedCols = ["A", "B", "C", "D"];
  var lastRow = spreadsheet.getLastRow();
  
  // Highlight the columns that can be edited for the calendars
  highlightedCols.forEach(column => {
    spreadsheet.getRange(column + ":" + column).setBackground("#f0d1ca");                     
  })
  
  // Kludge to clear background on cells past last row
   highlightedCols.forEach(column => {
    spreadsheet.getRange(column + (lastRow + 1) + ":" + column + (lastRow + 1000)).setBackground("#ffff");
  })
  
  // Autosize columns in SS
  spreadsheet.autoResizeColumns(1, lastColumn);
  
  // Legend  
  var legendPresent = spreadsheet.getRange("B" + lastRow).getValue();
   
  if (legendPresent !== "Editable cells for Calendars") {
    spreadsheet.getRange("A" + (lastRow + 2) ).setBackground("#f0d1ca");
    spreadsheet.setColumnWidth(1, 20).getRange("B" + (lastRow + 2) ).setValue("Editable cells for Calendars");
    
    // Autosize Legend Column 
    spreadsheet.setColumnWidth(1, 50)
  }
  
  
} // end addEvents()

// ****************************** End addEvents() Function ********************************* //