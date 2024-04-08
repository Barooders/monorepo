const fetch = require('node-fetch');
const AWS = require('aws-sdk');
const { create } = require('lodash');

const BUCKET_NAME = 'barooders-s3-bucket';
const PATH_PREFIX = 'private/bicyclebluebook';

// const STRAPI_URL = 'https://barooders-strapi.herokuapp.com';
const STRAPI_URL = 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

const bikeCategoryMapping = {
  Road: 'Vélos de route',
  Mountain: 'VTT',
  BMX: 'BMX',
  Gravel: 'Gravel',
  Kids: 'Vélos enfant',
  'Fat Bike': 'Fat Bike',
  Hybrid: 'VTC',
  Cyclocross: 'Cyclocross',
  'Track / Fixie / Singlespeed': 'Fixie et singlespeed',
};

const PRODUCT_TYPES = [
  { id: 926, name: 'Vélos de route' },
  { id: 1061, name: 'Vélos de route électriques' },
  { id: 861, name: 'Gravel' },
  { id: 931, name: 'Gravel électriques' },
  { id: 853, name: 'VTT' },
  { id: 856, name: 'VTT électriques' },
  { id: 1028, name: 'Vélos enfant' },
  { id: 860, name: 'BMX' },
  { id: 1082, name: 'Fat Bike' },
  { id: 928, name: 'VTC' },
  { id: 862, name: 'VTC électriques' },
  { id: 929, name: 'Cyclocross' },
  { id: 1075, name: 'Fixie et singlespeed' },
];

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getObjectContent = async (fileName) => {
  const key = fileName.includes(PATH_PREFIX)
    ? fileName
    : `${PATH_PREFIX}/${fileName}`;
  const params = {
    Bucket: BUCKET_NAME,
    Key: key,
  };

  const body = await s3.getObject(params).promise();

  return JSON.parse(body.Body.toString('utf-8'));
};

const paginatedListFiles = async (bucket, prefix) => {
  const files = [];
  let continuationToken = null;

  do {
    const params = {
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    };

    const response = await s3.listObjectsV2(params).promise();
    files.push(...response.Contents.map((file) => file.Key));
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return files;
};

const getModelName = (model, year, brand) => {
  return model
    .replace(year + ' ', '')
    .replace(brand + ' ', '')
    .replace('__', '/')
    .trim();
};

const updateFamily = async ({ id, productType }) => {
  // console.log(`Updating family ${id} with product type ${productType}`);
  const foundProductType = PRODUCT_TYPES.find((pt) => pt.name === productType);

  if (foundProductType == null) {
    throw new Error(`Unknown product type ${productType}`);
  }

  const url = `${STRAPI_URL}/api/pim-product-families/${id}`;
  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        productType: {
          connect: [
            ...(foundProductType !== undefined
              ? [
                  {
                    id: foundProductType.id,
                  },
                ]
              : []),
          ],
          disconnect: [],
        },
      },
    }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Failed to update family ${id}`);
  }
};

const MAPPING = {
  'Gazelle Bikes': 'Gazelle',
  Moustache: 'Moustache Bikes',
  'Frog Bikes': 'Frog',
  'Cube bikes': 'Cube',
  'BH Bikes': 'BH',
  Cervelo: 'Cervélo',
  'Yeti Cycles': 'Yeti',
};

const mappedName = (name) => {
  return MAPPING[name] || name;
};

const updateProductsFrom = async (brand) => {
  const files = (
    await paginatedListFiles(BUCKET_NAME, `${PATH_PREFIX}/data/${brand}`)
  )
    .filter((file) => file.endsWith('.json'))
    .filter((file) => !file.endsWith('simple-bikes.json'))
    .filter((file) => !file.endsWith('bikes.json'))
    .filter((file) => !file.endsWith('families.json'))
    .filter((file) => !file.endsWith('brandData.json'));

  if (files.length === 0) {
    console.log(`No files found for brand ${brand}`);
    return;
  }

  const { id: brandId } = await getBrand(mappedName(brand));

  if (brandId == null) {
    console.error(`Brand ${brand} not found`);
    return;
  }

  for (const file of files) {
    const split = file.split('/');
    const year = split[split.length - 2];
    const brand = split[split.length - 4];
    const family = split[split.length - 3];
    const model = split[split.length - 1].split('.')[0];

    const bikeContent = await getObjectContent(file);
    const { msrp, bicycleTypeName, isEbike } = bikeContent;

    const { id: familyId } = await getAndUpdateFamily({
      brand,
      brandId,
      family,
      bikeType: bicycleTypeName,
      isEbike,
    });

    await createOrUpdateProductModel({
      model,
      brand,
      brandId,
      familyId,
      year,
      msrp,
    });
  }
};

const getBrand = async (name) => {
  const response = await fetch(
    `${STRAPI_URL}/api/pim-brands?fields%5B0%5D=name&pagination%5Blimit%5D=1&filters%5Bname%5D%5B%24eq%5D=${name}`,
  );
  const result = await response.json();

  if (result.data.length === 0) {
    return {};
  }

  return result.data[0];
};

const getAndUpdateFamily = async ({
  brand,
  brandId,
  family,
  bikeType,
  isEbike,
}) => {
  const response = await fetch(
    `${STRAPI_URL}/api/pim-product-families?` +
      new URLSearchParams({
        'fields[0]': 'name',
        'pagination[limit]': 1,
        'filters[name][$eq]': family,
        'filters[brand][id][$eq]': brandId,
        populate: 'productType',
      }),
    {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    },
  );

  const result = await response.json();

  const category =
    bikeCategoryMapping[bikeType] + (isEbike ? ' électriques' : '');

  if (result.data.length === 0) {
    return await createFamily({ brandId, family, productType: category });
  } else {
    const familyId = result.data[0].id;

    if (bikeCategoryMapping[bikeType] == null) {
      console.error(`Unknown bike type ${bikeType} for family ${family}`);
      return { id: result.data[0].id };
    }

    if (result.data[0].attributes.productType.data != null) {
      return { id: familyId };
    }

    await updateFamily({
      id: familyId,
      productType: category,
    });
    return { id: familyId };
  }
};

const createFamily = async ({ brandId, family, productType }) => {
  const url = `${STRAPI_URL}/api/pim-product-families`;

  const foundProductType = PRODUCT_TYPES.find((pt) => pt.name === productType);

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        productModels: {
          disconnect: [],
          connect: [],
        },
        brand: {
          disconnect: [],
          connect: [
            {
              id: brandId,
            },
          ],
        },
        productType: {
          connect: [
            ...(foundProductType !== undefined
              ? [
                  {
                    id: PRODUCT_TYPES.find((pt) => pt.name === productType).id,
                  },
                ]
              : []),
          ],
          disconnect: [],
        },
        name: family,
      },
    }),
  };

  const response = await fetch(url, options);
  const result = await response.json();

  // console.log(`Family '${family}' created with id`, result.data.id);
  return result.data;
};

const createOrUpdateProductModel = async ({
  model,
  year,
  brandId,
  brand,
  familyId,
  msrp,
}) => {
  const response = await fetch(
    `${STRAPI_URL}/api/pim-product-models?fields%5B0%5D=name&pagination%5Blimit%5D=1&filters%5Bname%5D%5B%24eq%5D=${getModelName(model, year, brand)}`,
    {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    },
  );

  const result = await response.json();
  if (result.data.length === 0) {
    await createProductModel({
      model,
      brand,
      brandId,
      familyId,
      year,
      msrp,
    });
    return;
  }

  const id = result.data[0].id;

  const url = `${STRAPI_URL}/api/pim-product-models/${id}`;
  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        manufacturer_suggested_retail_price: msrp,
      },
    }),
  };

  const updateResponse = await fetch(url, options);

  if (!updateResponse.ok) {
    throw new Error(`Failed to update product model ${model}`);
  }
};

const createProductModel = async ({
  model,
  brand,
  brandId,
  familyId,
  year,
  msrp,
}) => {
  // console.log('Creating product model', model);

  const url = `${STRAPI_URL}/api/pim-product-models`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        name: getModelName(model, year, brand),
        brand: {
          disconnect: [],
          connect: [
            {
              id: brandId,
            },
          ],
        },
        productFamily: {
          disconnect: [],
          connect: [
            {
              id: familyId,
            },
          ],
        },
        year,
        manufacturer_suggested_retail_price: msrp,
      },
    }),
  };

  const response = await fetch(url, options);
  const result = await response.json();
  // console.log(`Model '${model}' created with id`, result.data.id);
};

const run = async () => {
  const brands = (await getObjectContent('data/brandData.json')).bicycleBrands;
  const idx = brands.findIndex(({ name }) => name === 'Bacchetta');

  const filtered = brands.slice(idx);

  for (const { name: brand } of filtered) {
    await updateProductsFrom(brand);
  }
};

run();
