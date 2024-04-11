// Replace these values with your Typesense configuration
const TYPESENSE_HOST = 'https://56bmiavw9gt0qkf3p.a1.typesense.net';
const TYPESENSE_API_KEY = 'y9qi4LerVoKw7vS6YS3qiXJDX8FWkZJg';
const TYPESENSE_COLLECTION_NAME = 'product_models';
const PRIVATE_SHEET = 'Barooders';
const MATCH_THRESHOLD = 1.3;

type ProductModel = {
  brand: string;
  family: string;
  name: string;
  productType: string;
  imageUrl: string;
  manufacturer_suggested_retail_price: number;
  year: string;
};

type Hit<T> = {
  document: T;
  text_match_info: {
    score: number;
  };
};

type Result = {
  hits: Hit<ProductModel>[];
};

type TypesenseProductModelResponse = {
  results: Result[];
};

type SearchPayload = {
  query_by: string;
  sort_by: string;
  collection: string;
  q: string;
  page: number;
  per_page: number;
};

function multiSearchInTypesense(
  queries: SearchPayload[],
): TypesenseProductModelResponse {
  const url = `${TYPESENSE_HOST}/multi_search`;

  const response = UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-TYPESENSE-API-KEY': TYPESENSE_API_KEY,
    },
    payload: JSON.stringify({ searches: queries }),
  });

  const result = JSON.parse(
    response.getContentText(),
  ) as TypesenseProductModelResponse;

  return result;
}

function searchPayload({
  brand,
  model,
  year,
  productType,
}: {
  brand: string;
  model: string;
  year: string;
  productType: string;
}): SearchPayload {
  const query = [brand, model, year, productType]
    .filter((value) => !!value)
    .join(' ');

  return {
    query_by: 'brand,family,name,productType',
    sort_by: '_text_match:desc',
    collection: 'product_models',
    q: query,
    page: 1,
    per_page: 1,
  };
}

function getBrand(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  brandColumnIndex: number,
): string {
  return sheet.getRange(row, brandColumnIndex).getValue();
}

function getModel(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  modelColumnIndex: number,
): string {
  return sheet.getRange(row, modelColumnIndex).getValue();
}

function getData(
  row: number,
  brandColumnIndex: number,
  modelColumnIndex: number,
  sheetName: string,
): Hit<ProductModel> | null {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName)!;

  const payload = searchPayload({
    brand: getBrand(sheet, row, brandColumnIndex),
    model: getModel(sheet, row, modelColumnIndex),
    year: '',
    productType: '',
  });

  const searchResult = multiSearchInTypesense([payload]).results[0].hits;

  if (searchResult.length == 0) {
    return null;
  }

  return searchResult[0];
}

function loopThroughFilledRows(
  brandColumnIndex: number,
  modelColumnIndex: number,
  sheetName: string,
  firstRetrievedDataIndex: number,
) {
  var sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PRIVATE_SHEET)!;
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  for (var i = 1; i < values.length; i++) {
    const data = getData(i + 1, brandColumnIndex, modelColumnIndex, sheetName);

    if (data == null) {
      continue;
    }

    Logger.log('data: ' + JSON.stringify(data));

    const {
      document: {
        brand: retrievedBrand,
        family: retrievedFamily,
        name: retrievedModel,
        imageUrl: retrievedImageUrl,
        year: retrievedYear,
        manufacturer_suggested_retail_price: retrievedPrice,
        productType: retrievedProductType,
      },
      text_match_info: { score },
    } = data;
    const normalizedScore = score / 1e18;

    if (normalizedScore < MATCH_THRESHOLD) {
      continue;
    }

    sheet.getRange(i + 1, firstRetrievedDataIndex).setValue(retrievedBrand);
    sheet
      .getRange(i + 1, firstRetrievedDataIndex + 1)
      .setValue(retrievedFamily);
    sheet.getRange(i + 1, firstRetrievedDataIndex + 2).setValue(retrievedModel);

    sheet.getRange(i + 1, firstRetrievedDataIndex + 3).setValue(retrievedYear);
    sheet.getRange(i + 1, firstRetrievedDataIndex + 4).setValue(retrievedPrice);
    sheet
      .getRange(i + 1, firstRetrievedDataIndex + 5)
      .setValue(retrievedProductType);
    sheet
      .getRange(i + 1, firstRetrievedDataIndex + 6)
      .setValue(retrievedImageUrl);
    sheet
      .getRange(i + 1, firstRetrievedDataIndex + 7)
      .setValue(normalizedScore);
  }
}

function sectorCiclismo() {
  const brandColumnIndex = 7;
  const modelColumnIndex = 8;
  const sheetName = 'Vendor';
  const firstRetrievedDataIndex = 21;

  loopThroughFilledRows(
    brandColumnIndex,
    modelColumnIndex,
    sheetName,
    firstRetrievedDataIndex,
  );
}
