const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const BUCKET_NAME = 'barooders-s3-bucket';
const PATH_PREFIX = 'private/buycycle';

const STRAPI_URL = 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN;

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const bikeCategoryMapping = {
  1: 'Vélos de route',
  2: 'Gravel',
  4: 'Vélos de route',
  19: 'VTT',
  26: 'VTT',
  27: undefined,
  28: 'VTT',
  29: 'VTT',
};

const PRODUCT_TYPES = [
  { id: 926, name: 'Vélos de route' },
  { id: 861, name: 'Gravel' },
  { id: 853, name: 'VTT' },
];

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

const createBrand = async (name) => {
  const url = `${STRAPI_URL}/api/pim-brands`;
  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: { name },
    }),
  };

  const response = await fetch(url, options);
  const result = await response.json();

  console.log(`Brand ${name} created:`, result);

  return result.data;
};

const getOrCreateBrand = async (name) => {
  console.log(`The brand ${name} is being searched`);

  if (name === 'Riese & Müller') {
    return { id: 3248 };
  }

  const response = await fetch(
    `${STRAPI_URL}/api/pim-brands?fields%5B0%5D=name&pagination%5Blimit%5D=1&filters%5Bname%5D%5B%24eqi%5D=${name}`,
  );
  const result = await response.json();

  console.log(JSON.stringify(result));

  if (result.data.length === 0) {
    return await createBrand(name);
  }

  console.log(`Brand ${name}:`, result.data[0]);
  return result.data[0];
};

const getOrCreateFamily = async ({ brand, brandId, family, productType }) => {
  const response = await fetch(
    `${STRAPI_URL}/api/pim-product-families?` +
      new URLSearchParams({
        'pagination[limit]': 1,
        'fields[0]': 'name',
        'filters[name][$eq]': family,
        'filters[brand][id][$eq]': brandId,

        'populate[1]': 'productType',
      }),
    {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    },
  );

  const result = await response.json();
  if (result.data.length === 0) {
    return await createFamily({ brandId, family, productType });
  } else {
    if (
      result.data[0].attributes.productType.data === null &&
      productType !== undefined
    ) {
      console.log(`Family ${family} has no product type`);
      await updateFamily({ id: result.data[0].id, productType });
    }
  }

  // console.log(`Family ${family} has id`, result.data[0].id);
  return result.data[0];
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

const updateFamily = async ({ id, productType }) => {
  const foundProductType = PRODUCT_TYPES.find((pt) => pt.name === productType);

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
                    id: PRODUCT_TYPES.find((pt) => pt.name === productType).id,
                  },
                ]
              : []),
          ],
          disconnect: [],
        },
      },
    }),
  };

  await fetch(url, options);
};

const getModelName = (model, year, brand) => {
  return model
    .replace(year + ' ', '')
    .replace(brand + ' ', '')
    .replace('__', '/')
    .trim();
};

const getOrCreateProductModel = async ({
  model,
  brand,
  brandId,
  familyId,
  year,
  imageUrl,
  manufacturer_suggested_retail_price,
}) => {
  const response = await fetch(
    `${STRAPI_URL}/api/pim-product-models?fields%5B0%5D=name&pagination%5Blimit%5D=1&filters%5Bname%5D%5B%24eqi%5D=${getModelName(model, year, brand)}`,
    {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    },
  );

  const result = await response.json();
  if (result.data.length === 0) {
    return await createProductModel({
      model,
      brand,
      brandId,
      familyId,
      year,
      imageUrl,
      manufacturer_suggested_retail_price,
    });
  } else {
    if (
      result.data[0].attributes.manufacturer_suggested_retail_price === null
    ) {
      console.log(`Updating price for ${model}`);
      await updateProductModel({
        id: result.data[0].id,
        manufacturer_suggested_retail_price,
      });
    }
  }

  return result.data[0];
};

const createProductModel = async ({
  model,
  brand,
  brandId,
  familyId,
  year,
  imageUrl,
  manufacturer_suggested_retail_price,
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
        imageUrl,
        manufacturer_suggested_retail_price,
      },
    }),
  };

  const response = await fetch(url, options);
  const result = await response.json();
  // console.log(`Model '${model}' created with id`, result.data.id);
};

const updateProductModel = async ({
  id,
  imageUrl,
  manufacturer_suggested_retail_price,
}) => {
  const url = `${STRAPI_URL}/api/pim-product-models/${id}`;
  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        manufacturer_suggested_retail_price,
      },
    }),
  };

  const response = await fetch(url, options);
  const result = await response.json();
};

const createProductForBrand = async (brand) => {
  const files = (
    await paginatedListFiles(BUCKET_NAME, `${PATH_PREFIX}/data/bikes/${brand}`)
  ).filter((file) => file.endsWith('.json'));

  console.log(`Found ${files.length} files for ${brand}`);

  if (files.length === 0) {
    return;
  }

  const bikes = (
    await Promise.all(files.map((file) => getObjectContent(file)))
  ).flatMap((d) => d.data);

  const { id: brandId } = await getOrCreateBrand(
    mappedName(bikes[0].brand.name),
  );

  for (const bike of bikes) {
    const { year, brand, family, name, image, bike_category_id, msrp } = bike;

    if (
      bikeCategoryMapping[bike_category_id] === undefined &&
      bike_category_id !== 27
    ) {
      console.log(
        `Unknown bike category: ${bike_category_id} for ${name} of ${brand.name} and family ${family.name}`,
      );
    }

    const { id: familyId } = await getOrCreateFamily({
      brand,
      brandId,
      family: family.name,
      productType: bikeCategoryMapping[bike_category_id],
    });

    await getOrCreateProductModel({
      model: name,
      brand,
      brandId,
      familyId,
      year,
      imageUrl:
        image != null
          ? `https://${BUCKET_NAME}.s3.amazonaws.com/private/buycycle/images/${image.file_name}`
          : undefined,
      manufacturer_suggested_retail_price: msrp,
    });
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

const checkProductTypes = async (productTypes) => {
  const errors = [];
  for (const { id, name } of productTypes) {
    const response = await fetch(
      `${STRAPI_URL}/api/pim-product-types?` +
        new URLSearchParams({
          'filters[name][$eq]': name,
        }),
      {
        headers: {
          Authorization: `Bearer ${STRAPI_TOKEN}`,
        },
      },
    );

    const result = await response.json();
    if (result.data[0].id !== id) {
      errors.push(`Product type ${name} not found with id ${id}`);
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'));
  }
};

const run = async () => {
  await checkProductTypes(PRODUCT_TYPES);

  const brands = require('./brandData.json').brands;

  const idx = brands.findIndex((n) => n.name === 'Riese & Müller');

  const filtered = brands.splice(idx);
  // const brands = [
  //   // 'ktm',
  //   // 'fantic',
  //   // 'moustache',
  //   // 'kalkhoff',
  //   // 'gitane',
  //   // 'basso',
  //   // 'mondraker',
  //   // 'riese-muller',
  //   // 'time',
  //   // 'whistle',
  //   // 'lee-cougan',
  //   // 'gasgas',
  // ];
  // console.log(filtered.map((n) => n.name).join('\n'));

  for (const { slug } of filtered) {
    console.log(`Processing ${slug}`);
    await createProductForBrand(slug);
  }
};

run();
