const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const baseUrl = 'https://api.bicyclebluebook.com/vg/api/brand/year/model';

const BRAND_IDs = {
  Specialized: 741,
  Cannondale: 672,
  Giant: 683,
};

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const BUCKET_NAME = 'barooders-s3-bucket';
const PATH_PREFIX = 'private/bicyclebluebook';

const uploadFile = (fileName, content) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${fileName}`,
    Body: content,
  };

  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

const doesFileExist = async (fileName) => {
  try {
    await s3.headObject({ Bucket: BUCKET_NAME, Key: fileName }).promise();
    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false;
    }
    throw err;
  }
};

const getObjectContent = async (fileName) => {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `${PATH_PREFIX}/${fileName}`,
  };

  const body = await s3.getObject(params).promise();

  return JSON.parse(body.Body.toString('utf-8'));
};

const downloadImageFromUrl = async (url, dest) => {
  const response = await fetch(url);
  const buffer = await response.buffer();

  uploadFile(dest, buffer);
};

const getBikeForYear = async ({ brand, family, year }) => {
  const brandDataDirectory = `${PATH_PREFIX}/data/${escape(brand)}`;
  const familiesDataDirectory = `${brandDataDirectory}/${escape(family)}`;
  const yearDirectory = `${familiesDataDirectory}/${year}`;

  const fileName = `${yearDirectory}/simple-bikes.json`;
  if (await doesFileExist(fileName)) {
    return getObjectContent(fileName);
  }

  const data = await fetch(
    `${baseUrl}?brandId=&brandName=${brand}&familyName=${family}&yearId=${year}`,
  );
  const models = (await data.json()).models;

  const bikes = models
    .flatMap((model) => model.bicycle.map((b) => ({ ...b, modelId: model.id })))
    .map((bike) => ({
      modelId: bike.modelId,
      bicycleId: bike.bicycleId,
      name: bike.bicycleName,
      family,
      year,
      imageSrc: bike.bicycleImageDefault,
    }));

  uploadFile(fileName, JSON.stringify(bikes));
  return bikes;
};

async function getBikesForBrandFamilyWithYear(brand, family) {
  const result = [];
  for (const year of family.years) {
    console.log(`Getting bikes for family ${family.name} and year ${year}`);
    try {
      const bikes = await getBikeForYear({ brand, family: family.name, year });
      result.push(bikes);
    } catch (e) {
      console.error(
        `Failed to get bikes for family ${family.name} and year ${year}`,
      );
      console.error(e);
    }
  }
  return result.flatMap((bikes) => bikes);
}

const getFamilies = async (brand) => {
  const data = await fetch(
    `https://api.bicyclebluebook.com/vg/api/model/families?brandName=${brand}`,
  );
  const body = await data.json();
  const families = body.map((family) => ({
    name: family.familyName,
    years: family.years.map((year) => year.id),
  }));

  return families;
};

const cacheFamily = async (brand) => {
  const brandDataDirectory = `${PATH_PREFIX}/data/${brand}`;

  if (await doesFileExist(`${brandDataDirectory}/families.json`)) {
    return getObjectContent(`${brandDataDirectory}/families.json`);
  }

  console.log('Retrieve families...');
  const families = await getFamilies(brand);

  uploadFile(`${brandDataDirectory}/families.json`, JSON.stringify(families));

  return families;
};

const cacheBikes = async (brand) => {
  const brandDataDirectory = `${PATH_PREFIX}/data/${brand}`;
  if (await doesFileExist(`${brandDataDirectory}/bikes.json`)) {
    return getObjectContent(`${brandDataDirectory}/bikes.json`);
  }

  const families = await cacheFamily(brand);

  console.log('Retrieve bikes for families...');
  const bikes = [];
  for (const family of families) {
    const familyBikes = await getBikesForBrandFamilyWithYear(brand, family);
    bikes.push(familyBikes);
  }

  uploadFile(`${brandDataDirectory}/bikes.json`, JSON.stringify(bikes));
  return bikes;
};

const additionalInfo = async (bike, brand) => {
  const data = await fetch(
    `https://api.bicyclebluebook.com/core/api/tradeIn/bicycle?brandId=${BRAND_IDs[brand]}&modelId=${bike.modelId}&yearId=${bike.year}`,
  );
  const body = await data.json();
  return {
    ...bike,
    ...body,
  };
};

const cacheAdditionalInfo = async (brand, bike) => {
  const brandDataDirectory = `${PATH_PREFIX}/data/${escape(brand)}`;
  const familiesDataDirectory = `${brandDataDirectory}/${escape(bike.family)}`;
  const yearDirectory = `${familiesDataDirectory}/${bike.year}`;

  const fileName = `${yearDirectory}/${escape(bike.name)}.json`;
  if (await doesFileExist(fileName)) {
    return getObjectContent(fileName);
  }

  console.log(`Retrieve info on product ${bike.name}...`);
  const more = await additionalInfo(bike, brand);

  uploadFile(fileName, JSON.stringify(more));
  return more;
};

const escape = (str) => str.replace(/\//g, '__');

function getImages(brand, bikes) {
  const brandDirectory = `${PATH_PREFIX}/images/${brand}`;

  bikes
    .filter((bike) => bike.imageSrc != null)
    .forEach(async ({ name, family, year, imageSrc }) => {
      const familyDirectory = `${brandDirectory}/${escape(family)}`;
      const yearDirectory = `${familyDirectory}/${year}`;

      let extension = imageSrc.split('.').pop();
      if (!['jpeg', 'jpg', 'png', 'webp'].includes(extension.toLowerCase())) {
        console.log(`Unknown extension for ${name} - ${extension}`);
        return;
      }
      const dest = `${yearDirectory}/${escape(name)}.${extension}`;
      try {
        await downloadImageFromUrl(imageSrc, dest);
      } catch (e) {
        console.error(`Failed to download image for ${name} - ${e}`);
      }
    });
}

const run = async () => {
  const brand = 'Giant';
  const simpleBikes = (await cacheBikes(brand)).flatMap((b) => b);

  const bikes = [];
  for (const bike of simpleBikes) {
    try {
      bikes.push(await cacheAdditionalInfo(brand, bike));
    } catch (e) {
      console.error(`Failed to cache additional info for ${bike.name} - ${e}`);
    }
  }

  console.log('Downloading images...');
  getImages(brand, bikes);
};

run();
