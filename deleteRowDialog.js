function deleteRowDialog() {
  let ui = SpreadsheetApp.getUi();

  let result = ui.prompt(
    "Delete a Calendar Event from the Spread Sheet & the Calendar",
    "Please enter a row number:",
    ui.ButtonSet.OK_CANCEL
  );

  // Process the user's response.
  let userInput = result.getResponseText();
  
  deleteRow(userInput);
  
}
