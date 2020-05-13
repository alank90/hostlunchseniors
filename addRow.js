function addRow(userInput) {
  // ****************************** Function addERow() *************************************** //

  // This function creates a Google Calendar event from SS row selected by user into the appropriate
  // Google Calendar by adding values from chosen SS row. It is executed by an installable 
  // onFormSubmit trigger that was attached to this SS.
  
  // Initialize Variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var calendarId = "scarsdaleschools.org_4mlv8k2irsd7ina5bq3o65i4i8@group.calendar.google.com";
  var selectedRowNumber = userInput;
  
  // First get the row range from userInput of which row to add
  // Note: rowValues is a two-dimensional array corresponding to the row as index of 1st 
  // array and column as index of second array
  
  var rowValues = spreadsheet.getRange("A" + selectedRowNumber + ":E" + selectedRowNumber).getValues(); // The User selected row
  var lastColumn = spreadsheet.getLastColumn();
  
  // Create new Calender Event from SS values
  var eventCal = CalendarApp.getCalendarById(calendarId); // get row's associated Google Calendar

  var title = rowValues[0][1]; // assign event title
  var startTime = rowValues[0][2]; // assign current row's "Start Time" cell value
  var endTime = rowValues[0][3];
  var description = rowValues[0][4];
    
  var event = {
       description: description
  };
  
  // Create a calendar event from one row's data.
  // See https://developers.google.com/apps-script/reference/calendar/calendar#createEvent(String,Date,Date,Object)
  eventCal.createEvent(title, startTime, endTime, event);
  
  // Now add the Calendar EventId to the row
  // Now retrieve all event objects in this row's given time range using row's info. See
  // https://developers.google.com/apps-script/reference/calendar/calendar-app#geteventsstarttime,-endtime
  var events = eventCal.getEvents(startTime, endTime);
  var ev = events[0]; // Get event from array. With multiple array items first item is last entered.
  
  // Store the eventID for given row using getId()
  // https://developers.google.com/apps-script/reference/calendar/calendar-event#getid
  var eventID = ev.getId();
 
  // Finally, set the calendarEventID value in the appropriate SS cell.
  spreadsheet.getRange(userInput, lastColumn).setValue(eventID);

}
