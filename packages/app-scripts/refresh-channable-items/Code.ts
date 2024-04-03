const SLACK_BOT_TOKEN =
  'xoxb-1554389548630-5309647657106-EKsSnQ72AOn43WAqqtBltjHP';
const ERROR_CHANNEL_ID = 'C05N03ZN9FD';

function executeOrAlert() {
  const url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
  try {
    exportBigQueryToExistingSheet();
  } catch (err) {
    alert(
      `💣 Error generating CSV for feed: ${err}\n\nClick here to access sheet: ${url}`,
    );

    throw err;
  }
}

function exportBigQueryToExistingSheet() {
  if (!BigQuery.Jobs) {
    throw new Error('Bigquery.Jobs is not accessible ');
  }

  const projectId = 'direct-tribute-354315';
  const tableId = 'direct-tribute-354315.dbt.feed_gmc_api';
  const existingSheetId = '1ZzOJItFmx_-VcCrfBKDsdpO7oZL2A81oiQsChrE_m2k';
  const sheetTabName = 'feed';
  const query = '#standardSQL\nSELECT * FROM ' + tableId;
  const queryRequest = {
    query: query,
  };

  const sheet = SpreadsheetApp.openById(existingSheetId);
  const sheetTab = sheet.getSheetByName(sheetTabName);

  if (!sheetTab) {
    throw new Error(`Could not open sheet tab with name ${sheetTabName}`);
  }

  Logger.log('Start retrieving data in BigQuery');
  let queryResults = BigQuery.Jobs.query(queryRequest, projectId);
  const jobId = queryResults.jobReference?.jobId;

  if (!jobId) {
    throw new Error(`Cannot access jobId`);
  }

  while (!queryResults.jobComplete) {
    Logger.log('Waiting for job to complete...');
    Utilities.sleep(500);
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }

  let rows = queryResults.rows ?? [];
  while (queryResults.pageToken) {
    Logger.log('Fetch next page...');
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken,
    });
    rows = rows.concat(queryResults.rows ?? []);
  }

  Logger.log('Starts mapping data...');
  const newValues = rows.map((row) =>
    row.f
      ? row.f.map((field) => {
          const value = field.v;
          if (typeof value === 'string' || value instanceof String) {
            // There is a 50 000 characters limit in Google Sheet cells
            return value.slice(0, 50000);
          }

          return value;
        })
      : [],
  );

  const [currentHeaders, ...currentValues] = sheetTab
    .getDataRange()
    .getDisplayValues();

  const newheaders =
    queryResults.schema?.fields?.map((field) => field.name) ?? [];

  sanityCheck(currentHeaders, currentValues, newheaders, newValues);

  Logger.log('Clear existing data in the sheet...');
  sheetTab.clear();

  Logger.log('Setting headers...');
  const headersRange = sheetTab.getRange(1, 1, 1, newheaders.length);
  headersRange.setValues([newheaders]);
  Logger.log('Headers has been set...');

  Logger.log('Setting values...');
  const lastRow = sheetTab.getLastRow();
  const valuesRange = sheetTab.getRange(
    lastRow + 1,
    1,
    newValues.length,
    newheaders.length,
  );
  valuesRange.setValues(newValues);
  Logger.log('Values has been set...');

  // Append data to the Google Sheet
  Logger.log('Exported ' + rows.length + ' rows to Google Sheet');
  Logger.log(
    'Exported BigQuery table ' + tableId + ' to Google Sheet: ' + sheetTabName,
  );
}

function sanityCheck(currentHeaders, currentValues, newheaders, newValues) {
  const MAXIMUM_AUTHORIZED_ITEMS_VARIATION = 0.3;
  const hasCorrectNumberOfColumns = currentHeaders.length === newheaders.length;
  const productNumberVariationsIsSmall =
    Math.abs(currentValues.length - newValues.length) / currentValues.length <
    MAXIMUM_AUTHORIZED_ITEMS_VARIATION;

  if (!hasCorrectNumberOfColumns) {
    throw new Error(`New data has incorrect number of columns:
  - Current headers: ${currentHeaders.join(' / ')}
  - New headers: ${newheaders.join(' / ')}
`);
  }

  if (!productNumberVariationsIsSmall) {
    throw new Error(
      `Variation of items number is too large: going from ${currentValues.length} to ${newValues.length} (max is ${MAXIMUM_AUTHORIZED_ITEMS_VARIATION * 100}% variation).`,
    );
  }
}

function alert(message) {
  const payload = {
    channel: ERROR_CHANNEL_ID,
    text: message,
  };

  const response = UrlFetchApp.fetch('https://slack.com/api/chat.postMessage', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + SLACK_BOT_TOKEN,
    },
    payload: JSON.stringify(payload),
  });

  if (response.getResponseCode() !== 200) {
    Logger.log('Cannot send Slack message: ' + response.getContentText());
  }
}
