//This function only serves as test for developping new features and for debugging
function test() {
  var sheet = SpreadsheetApp.getActive().getSheetByName("Vendor");
  DEVAPICSV.create_ID("A", ["E", "F", "G", "H"]);
}


//The code under this line is common at all CSV appscript files
function update() {
  DEVAPICSV.create_ID("A", ["E", "F", "G", "H"]);
  DEVAPICSV.create_ID("B", ["G", "H"]);
  DEVAPICSV.synchronizeSheets();
  DEVAPICSV.copyValuesInAlgo();
}

