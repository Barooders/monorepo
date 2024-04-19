type RowContent = string | object;

const SLACK_BOT_TOKEN =
  'xoxb-1554389548630-5309647657106-EKsSnQ72AOn43WAqqtBltjHP';
const ERROR_CHANNEL_ID = 'C05N03ZN9FD';
const GOOGLE_PROJECT_ID = 'direct-tribute-354315';

function syncGoogleWithoutCheck() {
  syncGoogle(false);
}
function syncMetaWithoutCheck() {
  syncMeta(false);
}
function syncNivealesWithoutCheck() {
  syncNiveales(false);
}

function syncGoogle(shouldCheck: boolean = true) {
  const tableId = 'direct-tribute-354315.dbt.feed_gmc_api';
  const existingSheetId = '1ZzOJItFmx_-VcCrfBKDsdpO7oZL2A81oiQsChrE_m2k';
  const sheetTabName = 'feed';

  Logger.log(
    `Start syncing https://docs.google.com/spreadsheets/d/${existingSheetId}/edit`,
  );

  try {
    const { headers, rows } = getBigqueryResults(
      GOOGLE_PROJECT_ID,
      `SELECT * FROM ${tableId}`,
    );
    const sheetRows = prepareQueryResults(rows);
    const sheetTab = getSheetTab(existingSheetId, sheetTabName);

    if (shouldCheck) sanityCheck(sheetTab, headers, sheetRows);
    insertDataInGoogleSheet(sheetTab, headers, sheetRows);
  } catch (err) {
    sendSlackAlert(`💣 Error generating CSV for feed google: ${err}`);

    throw err;
  }
}

function syncMeta(shouldCheck: boolean = true) {
  const tableId = 'direct-tribute-354315.dbt.feed_meta';
  const existingSheetId = '1uOwLh9H677CiHS2yvSTDE2hAmFzFYEBztecOIuAA6jk';
  const sheetTabName = 'feed';

  Logger.log(
    `Start syncing https://docs.google.com/spreadsheets/d/${existingSheetId}/edit`,
  );

  try {
    const { headers, rows } = getBigqueryResults(
      GOOGLE_PROJECT_ID,
      `SELECT * FROM ${tableId}`,
    );
    const sheetRows = prepareQueryResults(rows);
    const sheetTab = getSheetTab(existingSheetId, sheetTabName);

    if (shouldCheck) sanityCheck(sheetTab, headers, sheetRows);
    insertDataInGoogleSheet(sheetTab, headers, sheetRows);
  } catch (err) {
    sendSlackAlert(`💣 Error generating CSV for feed meta: ${err}`);

    throw err;
  }
}

function syncNiveales(shouldCheck: boolean = true) {
  const tableId = 'direct-tribute-354315.dbt.feed_niveales';
  const existingSheetId = '1nJDlym3ne_q2Lvkb0sqtJcncXh5N8Vy1A03rMMwuJ34';
  const sheetTabName = 'feed';

  Logger.log(
    `Start syncing https://docs.google.com/spreadsheets/d/${existingSheetId}/edit`,
  );

  try {
    const { headers, rows } = getBigqueryResults(
      GOOGLE_PROJECT_ID,
      `SELECT * FROM ${tableId}`,
    );
    const sheetRows = prepareQueryResults(rows);
    const sheetTab = getSheetTab(existingSheetId, sheetTabName);

    if (shouldCheck) sanityCheck(sheetTab, headers, sheetRows);
    insertDataInGoogleSheet(sheetTab, headers, sheetRows);
  } catch (err) {
    sendSlackAlert(`💣 Error generating CSV for feed niveales: ${err}`);

    throw err;
  }
}

function getBigqueryResults(
  projectId: string,
  sqlRawQuery: string,
): { headers: string[]; rows: GoogleAppsScript.BigQuery.Schema.TableRow[] } {
  if (!BigQuery.Jobs) {
    throw new Error('Bigquery.Jobs is not accessible ');
  }

  const query = `#standardSQL\n${sqlRawQuery}`;
  const queryRequest = {
    query: query,
  };

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

  return {
    headers:
      queryResults.schema?.fields?.map((field) => field.name ?? '') ?? [],
    rows,
  };
}

function prepareQueryResults(
  tableRows: GoogleAppsScript.BigQuery.Schema.TableRow[],
): RowContent[][] {
  return tableRows.map((row) =>
    row.f
      ? row.f.map((field) => {
          const value = field.v;
          if (typeof value === 'string' || value instanceof String) {
            // There is a 50 000 characters limit in Google Sheet cells
            return value.slice(0, 50000);
          }

          return value ?? '';
        })
      : [],
  );
}

function getSheetTab(sheetId: string, tabName: string) {
  const sheet = SpreadsheetApp.openById(sheetId);
  const sheetTab = sheet.getSheetByName(tabName);
  if (!sheetTab) {
    throw new Error(`Could not open sheet tab with name ${tabName}`);
  }

  return sheetTab;
}

function insertDataInGoogleSheet(
  sheetTab: GoogleAppsScript.Spreadsheet.Sheet,
  newHeaders: RowContent[],
  newValues: RowContent[][],
) {
  Logger.log('Clear existing data in the sheet...');
  sheetTab.clear();

  Logger.log('Setting headers...');
  const headersRange = sheetTab.getRange(1, 1, 1, newHeaders.length);
  headersRange.setValues([newHeaders]);
  Logger.log('Headers has been set...');

  Logger.log('Setting values...');
  const lastRow = sheetTab.getLastRow();
  const valuesRange = sheetTab.getRange(
    lastRow + 1,
    1,
    newValues.length,
    newHeaders.length,
  );
  valuesRange.setValues(newValues);
  Logger.log('Values has been set...');

  // Append data to the Google Sheet
  Logger.log('Exported ' + newValues.length + ' rows to Google Sheet');
}

function sanityCheck(
  sheetTab: GoogleAppsScript.Spreadsheet.Sheet,
  newHeaders: RowContent[],
  newValues: RowContent[][],
) {
  const [currentHeaders, ...currentValues] = sheetTab
    .getDataRange()
    .getDisplayValues();

  const MAXIMUM_AUTHORIZED_ITEMS_VARIATION = 0.3;
  const hasCorrectNumberOfColumns = currentHeaders.length === newHeaders.length;
  const productNumberVariationsIsSmall =
    (currentValues.length - newValues.length) / currentValues.length <
    MAXIMUM_AUTHORIZED_ITEMS_VARIATION;

  if (!hasCorrectNumberOfColumns) {
    throw new Error(`New data has incorrect number of columns:
  - Current headers: ${currentHeaders.join(' / ')}
  - New headers: ${newHeaders.join(' / ')}
`);
  }

  if (!productNumberVariationsIsSmall) {
    throw new Error(
      `Variation of items number is too large: going from ${currentValues.length} to ${newValues.length} (max is ${MAXIMUM_AUTHORIZED_ITEMS_VARIATION * 100}% variation).`,
    );
  }
}

function sendSlackAlert(message) {
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
