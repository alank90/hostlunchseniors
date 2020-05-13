function onFormSubmit(e) {
  
  // Define some variables
  var eventTitle = e.namedValues['Name'];
  var startDateTime = new Date(e.namedValues['Start Date & Time']); // variable comes from form as text
  var endDateTime = new Date(e.namedValues['End Date & Time']);
  var eventDescription = String(e.namedValues['How often would you like to offer this lunch?']); // Have to convert object to string
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var calendarId = "scarsdaleschools.org_4mlv8k2irsd7ina5bq3o65i4i8@group.calendar.google.com";
  var lastRow = spreadsheet.getLastRow();
  var lastColumn = spreadsheet.getLastColumn();
 
  // Create new Calender Event from Calendar ID
  var eventCal = CalendarApp.getCalendarById(calendarId); // get row's associated Google Calendar

  var event = {
       description: eventDescription
  };
  
  // Create a calendar event from e.values stored in variables above.
  // See https://developers.google.com/apps-script/reference/calendar/calendar#createEvent(String,Date,Date,Object)
  eventCal.createEvent(eventTitle, startDateTime, endDateTime, event);
  
  // =================================================================================================================== //
  // Now add the Calendar EventId to the row
  // Now retrieve all event objects in this row's given time range using row's info. See
  // https://developers.google.com/apps-script/reference/calendar/calendar-app#geteventsstarttime,-endtime
  var events = eventCal.getEvents(startDateTime, endDateTime);
  var index = events.length - 1; // get last calendar event at specific start time
  
  // Store the eventID for given row using getId()
  // https://developers.google.com/apps-script/reference/calendar/calendar-event#getid
  var eventID = events[0].getId();

  // Finally, set the calendarEventID value in the appropriate SS cell.
  spreadsheet.getRange(lastRow, lastColumn).setValue(eventID);
 
} // End onFormSubmit
