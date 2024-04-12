function normalizePrices(letterColsPrices) {
  Logger.log("normalizePrices() : start");
  var sourceSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Vendor");

  letterColsPrices.forEach(function(letterColPrice) {
    var colPrice = sourceSheet.getRange(letterColPrice + '1').getColumn();
    var range = sourceSheet.getRange(2, colPrice, sourceSheet.getLastRow() - 1, 1).getValues();

    var cleanedPrices = range.map(function (row) {
      var price = row[0].toString().replace(/[^\d,.]/g, "").replace(',', '.');
      row[0] = price.replace(/\./g, (_, index) => index === price.lastIndexOf('.') ? '.' : '').replace(/\.(?=\d{3}(?:\.|$))/, '');
      return row;
    });

    sourceSheet.getRange(2, colPrice, cleanedPrices.length, 1).setValues(cleanedPrices);
    sourceSheet.getRange(2, colPrice, cleanedPrices.length, 1).setNumberFormat("0");
  });

  Logger.log("normalizePrices() : end");
}


function checkPricesInAlgo() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Algo");

  var colState = 3;
  var colQuantity = 4;
  var colBaroodersPrice = 5;
  var colMSRP = 6;

  var range = sheet.getRange(2, 1, sheet.getLastRow() - 1, 6).getValues();

  var cleanedPrices = range.map(function (row) {
      row[colQuantity - 1] = row[colQuantity - 1].toString().replace(/[^\d]/g, '');
      if (row[colBaroodersPrice - 1] < 20) {
        row[colState - 1] = 0;
      }
      if (row[colMSRP - 1] < 20) {
        row[colMSRP - 1] = "";
      }
      return row;
    });

  sheet.getRange(2, 1, cleanedPrices.length, 6).setValues(cleanedPrices);
}

//extractURL functions could be factorized in a big one which recognizes with operations to do depending on the type of URL
function extractUrl_From_Drive(letterSourceCol, letterTargetCol) {
  var sourceSheet = SpreadsheetApp.getActive().getSheetByName("Vendor");
  var targetSheet = SpreadsheetApp.getActive().getSheetByName("Barooders");

  var numSourceCol = sourceSheet.getRange(letterSourceCol + '1').getColumn();
  var numTargetCol = targetSheet.getRange(letterTargetCol + '1').getColumn();

  var sourceRange = sourceSheet.getRange(2, numSourceCol, sourceSheet.getLastRow()-1, 1);
  var richTextValues = sourceRange.getRichTextValues();

  var modifiedValues = richTextValues.map(function(richTextCell) {
    var url = richTextCell[0].getLinkUrl() || "";
    if (url) {
      var substitutedValue = url.replace("/file/d/", "/uc?id=")
      .replace("/view?usp=drive_link", "&export=download")
      .replace("/view?usp=sharing", "&export=download");
      return [substitutedValue];
    } else {
      return [""];
    }
  });

  targetSheet.getRange(2, numTargetCol, modifiedValues.length, 1).setValues(modifiedValues);
}

function extractUrl_From_Imgur(letterSourceCol, letterTargetCol) {
  var sourceSheet = SpreadsheetApp.getActive().getSheetByName("Vendor");
  var targetSheet = SpreadsheetApp.getActive().getSheetByName("Barooders");

  var numSourceCol = sourceSheet.getRange(letterSourceCol + '1').getColumn();
  var numTargetCol = targetSheet.getRange(letterTargetCol + '1').getColumn();

  var sourceRange = sourceSheet.getRange(2, numSourceCol, sourceSheet.getLastRow() - 1, 1);
  var richTextValues = sourceRange.getRichTextValues();

  var modifiedValues = richTextValues.map(function(richTextCell) {
    var url = richTextCell[0].getLinkUrl() || "";
    if (url){
      if (url.includes("imgur")) {
        var substitutedValue = url.replace(".png", "").replace("//imgur", "//i.imgur");
        substitutedValue += ".webp?maxwidth=1520&fidelity=grand";
        return [substitutedValue];
      } else {
        return [url];
      }
    } else {
      return [""];
    }
  });

  // Set the modified values back to the target sheet
  targetSheet.getRange(2, numTargetCol, modifiedValues.length, 1).setValues(modifiedValues);
}

function extractUrl_From_Hyperlink(letterSourceCol, letterTargetCol) {
  var sourceSheet = SpreadsheetApp.getActive().getSheetByName("Vendor");
  var targetSheet = SpreadsheetApp.getActive().getSheetByName("Barooders");

  var numSourceCol = sourceSheet.getRange(letterSourceCol + '1').getColumn();
  var numTargetCol = targetSheet.getRange(letterTargetCol + '1').getColumn();

  var sourceRange = sourceSheet.getRange(2, numSourceCol, sourceSheet.getLastRow()-1, 1);
  var richTextValues = sourceRange.getRichTextValues();

  var modifiedValues = richTextValues.map(function(richTextCell) {
    var url = richTextCell[0].getLinkUrl() || "";
    if (url) {
      return [url];
    } else {
      return [""];
    }
  });

  targetSheet.getRange(2, numTargetCol, modifiedValues.length, 1).setValues(modifiedValues);
}
