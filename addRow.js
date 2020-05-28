function addRow(userInput) {
  // ****************************** Function addRow() *************************************** //

  // This function creates a Google Calendar event from SS row selected by user into the appropriate
  // Google Calendar by adding values from chosen SS row. It is executed by a Memu item.

  // Initialize Variables
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var calendarId =
    "scarsdaleschools.org_4mlv8k2irsd7ina5bq3o65i4i8@group.calendar.google.com";
  var selectedRowNumber = userInput;

  // Get the row range(values) from row to add
  // Note: rowValues is a two-dimensional array corresponding to the "row" as index of 1st
  // array and "column" as index of second array

  // First, need to create a timeStamp value for first column
  var today = new Date();
  var date =
    today.getMonth() + 1 + "-" + today.getDate() + "-" + today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date + " " + time;
  var timeStamp = new Date(dateTime);
  timeStamp.setSeconds(0);

  // Set Timestamp in SS
  var cell = spreadsheet.getRange(selectedRowNumber, 1);
  cell.setValue(timeStamp); // assign timeStamp to selectedRowNumber cell

  var rowValues = spreadsheet
    .getRange("A" + selectedRowNumber + ":E" + selectedRowNumber)
    .getValues(); // The User selected row
  var lastColumn = spreadsheet.getLastColumn();

  // Create new Calender Event from SS values
  var eventCal = CalendarApp.getCalendarById(calendarId); // get row's associated Google Calendar

  var title = rowValues[0][1]; // assign event title

  var startTime = rowValues[0][2]; // assign current row's "Start Time" cell value
  var endTime = rowValues[0][3];
  // Create a new Date() from startTime w/new end time
  // The end time is from endTime variable. This in case we need to create an event series.
  var endHours = endTime.getHours();
  var endMinutes = endTime.getMinutes();
  var startEndTime = new Date(startTime);
  startEndTime.setHours(endHours);
  startEndTime.setMinutes(endMinutes);

  var description = rowValues[0][4];

  var event = {
    description: description,
  };

  // Create a calendar event from one row's data.
  // See https://developers.google.com/apps-script/reference/calendar/calendar#createEvent(String,Date,Date,Object)
  // Check if is a single event or an event series
  var dayMonthStart = startTime.getDate() + "/" + startTime.getMonth();
  var dayMonthEnd = endTime.getDate() + "/" + endTime.getMonth();

  if (dayMonthStart === dayMonthEnd) {
    eventCal.createEvent(title, startTime, endTime, event);
  } else {
    // Creates a rule that recurs every week.
    var recurrence = CalendarApp.newRecurrence().addWeeklyRule().until(endTime);
    eventCal.createEventSeries(
      title,
      startTime,
      startEndTime,
      recurrence,
      event
    );
  }

  // =================================================================================================================== //
  // Now add the Calendar EventId to the row
  // Now retrieve all event objects in this row's given time range using row's info. See
  // https://developers.google.com/apps-script/reference/calendar/calendar-app#geteventsstarttime,-endtime
  var events = eventCal.getEvents(startTime, endTime);
  var currentTitle = "";
  var eventId = "";
  var currentTimeStamp = null;

  // Store the eventID for given row using getId()
  // https://developers.google.com/apps-script/reference/calendar/calendar-event#getid
  events.forEach((element) => {
    currentTitle = element.getTitle();
    currentTimeStamp = element.getDateCreated();
    currentTimeStamp.setSeconds(0);

    // Do a check if form response entry matches on several fields with the current event series element.
    // Then we'll know to grab that event ID. Problem is getEvents() returns all events that fall within
    // the startTime & endTime that was entered in SS. So we have to iterate thru results to check for
    // our event. i.e. if there are 8 teacher entries for 12pm on the 26th we have to check all of them
    // to see which is ours. The results are returned by startTime not by last entered.
    if (
      title === currentTitle &&
      timeStamp.getTime() === currentTimeStamp.getTime()
    ) {
      eventId = element.getId();

      // Finally, set the calendarEventID value in the appropriate SS cell.
      spreadsheet.getRange(userInput, lastColumn).setValue(eventId);
    }
  }); // end forEach
}
