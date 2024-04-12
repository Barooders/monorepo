// Replace these values with your Typesense configuration
const TYPESENSE_HOST = 'https://56bmiavw9gt0qkf3p.a1.typesense.net';
const TYPESENSE_API_KEY = 'y9qi4LerVoKw7vS6YS3qiXJDX8FWkZJg';
const TYPESENSE_COLLECTION_NAME = 'product_models';
const VENDOR_SHEET = 'Vendor';
const PRIVATE_SHEET = 'Vendor';
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

function getSheetTab(tabName: string): GoogleAppsScript.Spreadsheet.Sheet {
  const sheetTab =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);

  if (!sheetTab) {
    throw new Error(`Could not find sheet tab with name ${tabName}`);
  }

  return sheetTab;
}

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

function getValue<Type = string>(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  row: number,
  brandColumnIndex: number,
): Type {
  return sheet.getRange(row, brandColumnIndex).getValue();
}

function retrieveInPim(
  row: number,
  columns: Record<string, number>,
): Hit<ProductModel> | null {
  var sheet = getSheetTab(VENDOR_SHEET);

  const payload = searchPayload({
    brand: getValue(sheet, row, columns['Brand']),
    model: getValue(sheet, row, columns['Model']),
    year: '', // getValue(sheet, row, columns['Year']),
    productType: '', // getValue(sheet, row, columns['Type de produit']),
  });

  const searchResult = multiSearchInTypesense([payload]).results[0].hits;

  if (searchResult.length == 0) {
    return null;
  }

  return searchResult[0];
}

function loopThroughFilledRows() {
  var sheet = getSheetTab(PRIVATE_SHEET)!;
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();

  const baroodersColumns = getColumns(PRIVATE_SHEET);
  const vendorColumns = getColumns(VENDOR_SHEET);

  for (var row = 2; row <= values.length; row++) {
    const data = retrieveInPim(row, vendorColumns);

    if (data == null) {
      continue;
    }

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

    sheet
      .getRange(row, baroodersColumns['[PIM] Marque'])
      .setValue(retrievedBrand);
    sheet
      .getRange(row, baroodersColumns['[PIM] Famille'])
      .setValue(retrievedFamily);
    sheet
      .getRange(row, baroodersColumns['[PIM] Modèle'])
      .setValue(retrievedModel);
    sheet
      .getRange(row, baroodersColumns['[PIM] Année'])
      .setValue(retrievedYear);
    sheet
      .getRange(row, baroodersColumns['[PIM] Prix neuf'])
      .setValue(retrievedPrice);
    sheet
      .getRange(row, baroodersColumns['[PIM] Type'])
      .setValue(retrievedProductType);
    sheet
      .getRange(row, baroodersColumns['[PIM] Image'])
      .setValue(retrievedImageUrl);
    sheet
      .getRange(row, baroodersColumns['[PIM] Score'])
      .setValue(normalizedScore);
  }
}

function getColumns(sheetName: string): Record<string, number> {
  const sheet = getSheetTab(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

  const headersIndex = headers.reduce(
    (acc, header, index) => {
      acc[header] = index + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return headersIndex;
}
