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

    sheet.getRange(row, vendorColumns['[PIM] Marque']).setValue(retrievedBrand);
    sheet
      .getRange(row, vendorColumns['[PIM] Famille'])
      .setValue(retrievedFamily);
    sheet.getRange(row, vendorColumns['[PIM] Modèle']).setValue(retrievedModel);
    sheet.getRange(row, vendorColumns['[PIM] Année']).setValue(retrievedYear);
    sheet
      .getRange(row, vendorColumns['[PIM] Prix neuf'])
      .setValue(retrievedPrice);
    sheet
      .getRange(row, vendorColumns['[PIM] Type'])
      .setValue(retrievedProductType);
    sheet
      .getRange(row, vendorColumns['[PIM] Image'])
      .setValue(retrievedImageUrl);
    sheet.getRange(row, vendorColumns['[PIM] Score']).setValue(normalizedScore);
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

function addProductToPim(row: number, vendorColumns: Record<string, number>) {
  var sheet = getSheetTab(VENDOR_SHEET);

  const isPimModelKo =
    getValue(sheet, row, vendorColumns['[PIM] ok'])?.toLowerCase() === 'ko';

  if (!isPimModelKo) {
    return;
  }

  const textBody = JSON.stringify({
    name: getValue(sheet, row, vendorColumns['Model']),
    manufacturer_suggested_retail_price:
      getValue(sheet, row, vendorColumns['MSRP']) ?? undefined,
    imageUrl: getValue(sheet, row, vendorColumns['Image']),
    brand: {
      name: getValue(sheet, row, vendorColumns['Brand']),
    },
    // year: Number(getValue(sheet, row, vendorColumns['Année'])),
    // productType: getValue(sheet, row, vendorColumns['Category']),
  });

  Logger.log('Adding product to PIM: ' + textBody);

  try {
    const response = UrlFetchApp.fetch(
      `https://backend.barooders.com/v1/products/models`,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'Api-Key ' + BAROODERS_BACKEND_API_KEY,
        },
        payload: textBody,
      },
    );

    if (response.getResponseCode() !== 200) {
      Logger.log('Cannot add product to PIM: ' + response.getContentText());
    } else {
      Logger.log('Product has been added to PIM');
    }
  } catch (error) {
    Logger.log('Cannot add product to PIM: ' + error);
  }
}

function addAllMissingProductToPim() {
  const vendorColumns = getColumns(VENDOR_SHEET);
  var sheet = getSheetTab(VENDOR_SHEET)!;

  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  for (var row = 2; row <= values.length; row++) {
    addProductToPim(row, vendorColumns);
  }
}
