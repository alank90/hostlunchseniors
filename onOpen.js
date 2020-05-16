// *********************** Function onOpen() ********************************************** //

function onOpen() {
  // Function runs on SS open to create menu items for SS

  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Sync to Calendar")
    .addItem("Add a Calendar Event from SS", "addRowDialog")
    .addItem("Add Events to Calendar(s)", "addEventsDialog")
    .addItem("Delete Calendar Event", "deleteRowDialog")
    .addToUi();
}

// *********************** End Function onOpen() ********************************************** //
