function create_ID(letterColID, list_letter_col_to_calculate_ID, optionalSheetName) {
  Logger.log("create_ID() : start");
  
  var sheetName = "Vendor";
  if (optionalSheetName != null) {
    sheetName = optionalSheetName;
  }

  var sheet = SpreadsheetApp.getActive().getSheetByName(sheetName);
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  var numColID = sheet.getRange(letterColID + '1').getColumn();
  var dataRange = sheet.getRange(2, numColID, lastRow - 1, lastCol - 1 + numColID);
  var data = dataRange.getValues();

  data.forEach(function(row) {
    var valuesToGenerateID = list_letter_col_to_calculate_ID.map(function(letter) {
      var columnIndex = sheet.getRange(letter + '1').getColumn();
      return row[columnIndex - numColID];
    });

    var allEmpty = valuesToGenerateID.every(function(element) {
        return element === '';
      });
    var generatedID = allEmpty ? '' : generate_ID(valuesToGenerateID);
    row[0] = generatedID;
  });

  var data_to_push = data.map(function(row) { return [row[0]]; });
  var col_to_fill = sheet.getRange(2, numColID, lastRow - 1, 1);
  col_to_fill.setValues(data_to_push);
  Logger.log("create_ID() : end");
}

function generate_ID(...inputs) {
  var concatenatedValues = inputs.join(',');
  var rawHash = Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, concatenatedValues);
  var txtHash = Array.from(new Uint8Array(rawHash))
    .map(byte => (byte < 0 ? byte + 256 : byte).toString(16).padStart(2, '0'))
    .join('');
  return txtHash.slice(0, 16);
}

function updateSheets() {
      synchronizeSheets();
      copyValuesInAlgo();
}

function synchronizeSheets() {
  Logger.log("synchronizeSheets() : start");
  var vendorSheet = SpreadsheetApp.getActive().getSheetByName("Vendor");
  var baroodersSheet = SpreadsheetApp.getActive().getSheetByName("Barooders");

  var lastRowVendor = vendorSheet.getLastRow();
  var lastRowBarooders = baroodersSheet.getLastRow();
  var lastColBarooders = baroodersSheet.getLastColumn();
  var maxRowBarooders = baroodersSheet.getMaxRows();


  if (lastRowVendor > 2 & lastRowBarooders > 1) {
    if (maxRowBarooders < lastRowVendor) {
      baroodersSheet.insertRowsAfter(maxRowBarooders, lastRowVendor - maxRowBarooders);
    }
    baroodersSheet.getRange(3, 1, maxRowBarooders - 2, lastColBarooders).clearContent();
    
    var rangeToCopy = baroodersSheet.getRange(2, 1, 1, baroodersSheet.getLastColumn());
    var rangeToPaste = baroodersSheet.getRange(3, 1, lastRowVendor - 2, baroodersSheet.getLastColumn());
    rangeToCopy.copyTo(rangeToPaste);
  }
  Logger.log("synchronizeSheets() : end");
}

function copyValuesInAlgo() {
  Logger.log("copyValuesInAlgo() : start");
  var sheetSource = SpreadsheetApp.getActive().getSheetByName('Barooders');
  var sheetTarget = SpreadsheetApp.getActive().getSheetByName('Algo');

  if (true) { // To cut all synchros at once (true = activate, false = deactivate)
    var sourceRange = sheetSource.getDataRange();
    var sourceValues = sourceRange.getValues();

    var newValues = sourceValues.map(function(row) {
      return row.map(function(cellValue) {
        return (cellValue === '#VALUE!' || cellValue === '#REF!') ? '' : cellValue;
      });
    });

    sheetTarget.clearContents();
    sheetTarget.getRange(1, 1, newValues.length, newValues[0].length).setValues(newValues);

    checkPrices();
    Logger.log("Waiting for user to close the popup")
    informUser();
  }

  Logger.log("copyValuesInAlgo() : end");
}

function checkPrices() {
  var sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Barooders");
  var targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Algo");

  var colState = 3;
  var colQuantity = 4;
  var colBaroodersPrice = 5;
  var colMSRP = 6;

  var range = sourceSheet.getRange(2, 1, sourceSheet.getLastRow() - 1, 6).getValues();

  var cleanedPrices = range.map(function (row) {
    var baroodersPrice = row[colBaroodersPrice - 1].toString().replace(/[^\d.,]/g, '').replace(',', '.');
    var msrp = row[colMSRP - 1].toString().replace(/[^\d.,]/g, '').replace(',', '.');
    baroodersPrice = baroodersPrice.replace(/\./g, (_, index) => index === baroodersPrice.lastIndexOf('.') ? '.' : '');
    msrp = msrp.replace(/\./g, (_, index) => index === msrp.lastIndexOf('.') ? '.' : '');

    row[colBaroodersPrice - 1] = /^\d+(\.\d+)?$/.test(baroodersPrice) ? baroodersPrice : "";
    row[colMSRP - 1] = /^\d+(\.\d+)?$/.test(msrp) ? msrp : "";

    if (row[colBaroodersPrice - 1] == "") {
      row[colState - 1] = 0;
    }

    return row;
  });

  targetSheet.getRange(2, 1, cleanedPrices.length, 6).setValues(cleanedPrices);
}

function informUser() {
  var ui = SpreadsheetApp.getUi();
  ui.alert('Update successful', 'You can close the file now.', ui.ButtonSet.OK);
}
