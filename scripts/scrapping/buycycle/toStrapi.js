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
  const response = await fetch(
    `${STRAPI_URL}/api/pim-brands?fields%5B0%5D=name&pagination%5Blimit%5D=1&filters%5Bname%5D%5B%24eq%5D=${name}`,
  );
  const result = await response.json();

  console.log(JSON.stringify(result));

  if (result.data.length === 0) {
    return await createBrand(name);
  }

  console.log(`Brand ${name}:`, result.data[0]);
  return result.data[0];
};

const getOrCreateFamily = async ({ brand, brandId, family }) => {
  const response = await fetch(
    `${STRAPI_URL}/api/pim-product-families?fields%5B0%5D=name&pagination%5Blimit%5D=1&filters%5Bname%5D%5B%24eq%5D=${family}&filters%5Bbrand%5D%5Bid%5D%5B%24eq%5D=${brandId}`,
    {
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
    },
  );
  const result = await response.json();
  if (result.data.length === 0) {
    return await createFamily({ brandId, family });
  }

  // console.log(`Family ${family} has id`, result.data[0].id);
  return result.data[0];
};

const createFamily = async ({ brandId, family }) => {
  const url = `${STRAPI_URL}/api/pim-product-families`;
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
        name: family,
      },
    }),
  };

  const response = await fetch(url, options);
  const result = await response.json();

  // console.log(`Family '${family}' created with id`, result.data.id);
  return result.data;
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
    return await createProductModel({
      model,
      brand,
      brandId,
      familyId,
      year,
      imageUrl,
    });
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
      },
    }),
  };

  const response = await fetch(url, options);
  const result = await response.json();
  // console.log(`Model '${model}' created with id`, result.data.id);
};

const updateProductModel = async ({ id, imageUrl }) => {
  const url = `${STRAPI_URL}/api/pim-product-models/${id}`;
  const options = {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        imageUrl: imageUrl,
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
    const { year, brand, family, name, image } = bike;

    const { id: familyId } = await getOrCreateFamily({
      brand,
      brandId,
      family: family.name,
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

const run = async () => {
  // const brands = (await getObjectContent('data/brandData.json')).bicycleBrands;
  const brands = [
    // 'ktm',
    // 'fantic',
    // 'moustache',
    // 'kalkhoff',
    // 'gitane',
    // 'basso',
    // 'mondraker',
    'riese-muller',
    // 'time',
    // 'whistle',
    // 'lee-cougan',
    // 'gasgas',
  ];

  for (const brand of brands) {
    await createProductForBrand(brand);
  }
};

run();
