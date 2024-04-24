function update() {
  DEVAPICSV.create_ID('A', ['C']);
  DEVAPICSV.create_ID('B', ['H']);
  DEVAPICSV.normalizePrices(['P', 'Q', 'R', 'S', 'V']);
  DEVAPICSV.synchronizeSheets();
  DEVAPICSV.copyValuesInAlgo();

  addAllMissingProductToPim();
}
