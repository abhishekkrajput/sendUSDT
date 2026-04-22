function doPost(e) {
  try {
    // Now that you've authorized it, we can safely use the bound spreadsheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the incoming JSON payload from our frontend
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date();
    
    // Add a new row: [Timestamp, Contract Address, User/Token Address]
    // Adjust headers in your sheet 1st row: "Timestamp", "Contract Address", "User Address"
    sheet.appendRow([timestamp, data.contractAddress, data.userAddress]);
    
    // Return success response to the web app
    var response = ContentService.createTextOutput(JSON.stringify({ "status": "success", "message": "Data logged successfully" }))
                         .setMimeType(ContentService.MimeType.JSON);
    
    // Handle CORS (if needed, but usually Apps Script handles OPTIONS requests automatically if published to execute as user/anyone)
    return response;
  } catch(error) {
    // Attempt to log the error to the sheet so we can debug silent webhook failures
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.appendRow([new Date(), "ERROR", error.toString()]);
    } catch(e) {}
    
    // Return error if something goes wrong
    return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() }))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Just in case someone visits the URL directly in a browser
function doGet() {
  return ContentService.createTextOutput("Backend is running! Please use POST to send data.");
}
