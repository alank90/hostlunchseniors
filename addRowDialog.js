function addRowDialog() {
  let ui = SpreadsheetApp.getUi();

  let result = ui.prompt(
    "Add a Calendar Event from the Spread Sheet",
    "Please enter a row number:",
    ui.ButtonSet.OK_CANCEL
  );

  // Process the user's response.
  let userInput = result.getResponseText();
  
  addRow(userInput);
  
}
