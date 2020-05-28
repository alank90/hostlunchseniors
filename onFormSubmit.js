function onFormSubmit(e) {
  // Define some variabless
  /*jshint -W069 */
  var eventTitle = String(e.namedValues["Name"]);
  var timeStamp = String(e.namedValues["Timestamp"]);
  timeStamp = new Date(timeStamp);
  timeStamp.setSeconds(0);

  /*jshint +W069 */
  var startDateTime = new Date(e.namedValues["Start Date & Time"]); // variable comes from form as text
  var endDateTime = new Date(e.namedValues["End Date & Time"]);
  // Get and set first occurence Event end time
  var endHours = endDateTime.getHours();
  var endMinutes = endDateTime.getMinutes();
  var startEndTime = new Date(startDateTime);
  startEndTime.setHours(endHours);
  startEndTime.setMinutes(endMinutes);

  var currentRowInsertedByForm = e.range.getRow();

  var eventDescription = String(
    e.namedValues["How often would you like to offer this lunch?"]
  ); // Have to convert object to string

  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var calendarId =
    "scarsdaleschools.org_4mlv8k2irsd7ina5bq3o65i4i8@group.calendar.google.com";
  var lastRow = spreadsheet.getLastRow();
  var lastColumn = spreadsheet.getLastColumn();

  // Create new Calender Class
  var eventCal = CalendarApp.getCalendarById(calendarId); // get the calendar

  var event = {
    description: eventDescription,
  };

  // Create a calendar event from e.values stored in variables above.
  // See https://developers.google.com/apps-script/reference/calendar/calendar#createEvent(String,Date,Date,Object)

  // Check if is a single event or an event series
  var dayMonthStart = startDateTime.getDate() + "/" + startDateTime.getMonth();
  var dayMonthEnd = endDateTime.getDate() + "/" + endDateTime.getMonth();

  if (eventDescription !== "One time" && eventDescription !== "Once a week") {
    eventCal.createEvent(eventTitle, startDateTime, endDateTime, event);
    GmailApp.sendEmail(
      "mdutra@scarsdaleschools.org,akillian@scarsdaleschools.org",
      eventTitle,
      eventDescription
    );
  } else if (dayMonthStart === dayMonthEnd) {
    eventCal.createEvent(eventTitle, startDateTime, endDateTime, event);
  } else {
    // Creates a rule that recurs every week.
    var recurrence = CalendarApp.newRecurrence()
      .addWeeklyRule()
      .until(endDateTime);
    eventCal.createEventSeries(
      eventTitle,
      startDateTime,
      startEndTime,
      recurrence,
      event
    );
  }

  // =================================================================================================================== //
  // Now add the Calendar EventId to the row
  // Now retrieve all event objects in this row's given time range using row's info. See
  // https://developers.google.com/apps-script/reference/calendar/calendar-app#geteventsstarttime,-endtime
  var events = eventCal.getEvents(startDateTime, endDateTime);
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
    // the startTime & endTime that was entered in form. So we have to iterate thru results to check for
    // our event. i.e. if there are 8 teacher entries for 12pm on the 26th we have to check all of them
    // to see which is ours. The results are returned by startTime not by last entered.
    if (
      eventTitle === currentTitle &&
      timeStamp.getTime() === currentTimeStamp.getTime()
    ) {
      eventId = element.getId();
      // Finally, set the calendarEventID value in the appropriate SS cell.
      spreadsheet
        .getRange(currentRowInsertedByForm, lastColumn)
        .setValue(eventId);
    }
  }); // end forEach
} // End onFormSubmit
