function update() {
  DEVAPICSV.create_ID('A', ['C']);
  DEVAPICSV.create_ID('B', ['G']);
  DEVAPICSV.normalizePrices(['O', 'U']);
  DEVAPICSV.synchronizeSheets();
  DEVAPICSV.copyValuesInAlgo();
}
