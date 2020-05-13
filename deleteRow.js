// ***************************** deleteEvent() *****************************************  //

function deleteRow(userInput) {
  // Function takes Active Sheet, deletes the Calendar Event via the Calendar Event ID
  // and then deletes the row in the SS

  var spreadsheet = SpreadsheetApp.getActiveSheet();
  var calendarId = "scarsdaleschools.org_4mlv8k2irsd7ina5bq3o65i4i8@group.calendar.google.com";
  var calendar = CalendarApp.getCalendarById(calendarId);
  
  var lastCol = spreadsheet.getLastColumn();
  var calEventId = spreadsheet.getRange(userInput, lastCol).getValue();
  
  // Delete the Calendar Event 
  calendar.getEventById(calEventId).deleteEvent();
  
  // Now Delete the row in the SS
  spreadsheet.deleteRow(userInput);
  
  }

// ***************************** End deleteEvent() *****************************************  //