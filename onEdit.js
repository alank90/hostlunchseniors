
// ************************************* Function onEdit() *********************************** //
function onEdit(e) {
  // This function is executed by an Installable Trigger setup on the onEdit() script.
  // When someone edits a cell the function is called and values needed for
  // updating the row are retrieved and then a command is issued to update
  // the proper event in the Calendar.

  /* 
     Installable triggers let Apps Script run a function automatically when 
     a certain event, such as opening a document, occurs. 
     See - https://developers.google.com/apps-script/guides/triggers/installable
    */

  /* 
     Simple triggers and installable triggers let Apps Script run a function automatically 
     if a certain event occurs. When a trigger fires, Apps Script passes the function an event 
     object as an argument, typically called e. The event object contains information about the 
     context that caused the trigger to fire. 
     See - https://developers.google.com/apps-script/guides/triggers/events
    */
  var editedCell = e.range; //editedCell now has cell reference via e event object property range.
   
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var currentRow = editedCell.getRow();
  var currentCol = editedCell.getColumn();
  var lastCol = ss.getLastColumn();
  var colName = ss.getRange(1, currentCol).getValue();
  var calEventId = ss.getRange(currentRow, lastCol).getValue();
  
  // Check for CalID in row and edit cell and update Calendar event if ID present
  if (calEventId == "") {
    return Logger.log("No Calendar Event ID Present");
  } 
  else {
    var calId = "scarsdaleschools.org_4mlv8k2irsd7ina5bq3o65i4i8@group.calendar.google.com";
    var currentCalendar = CalendarApp.getCalendarById(calId);
    var getRowContents = ss.getRange(currentRow, 1, 1, lastCol).getValues();
    
    // Assign Sheet Cell values from row being edited to corresponding Calendar Fields
    currentCalendar
     .getEventById(calEventId)
     .setTime(getRowContents[0][2], getRowContents[0][3]);
    currentCalendar.getEventById(calEventId).setDescription(getRowContents[0][4]);
    currentCalendar.getEventById(calEventId).setTitle(getRowContents[0][1]);
  } // end else
  
} // End onEdit Function

// ****************************** End onEdit() ******************************************* //

