const fs = require('node:fs');
const path = require('path');
const fetch = require('node-fetch');

const baseUrl = 'https://api.bicyclebluebook.com/vg/api/brand/year/model';

const downloadImageFromUrl = async (url, dest) => {
  const response = await fetch(url);
  const buffer = await response.buffer();

  fs.writeFileSync(dest, buffer);
};

const getBikeForYear = async ({ brand, family, year }) => {
  const data = await fetch(
    `${baseUrl}?brandId=&brandName=${brand}&familyName=${family}&yearId=${year}`,
  );
  const models = (await data.json()).models;

  const bikes = models
    .flatMap((model) => model.bicycle)
    .map((bike) => ({
      name: bike.bicycleName,
      family,
      year,
      imageSrc: bike.bicycleImageDefault,
    }));

  return bikes;
};

async function getBikesForBrandFamilyWithYear(brand, family) {
  const result = [];
  for (const year of family.years) {
    console.log(`Getting bikes for family ${family.name} and year ${year}`);
    const bikes = await getBikeForYear({ brand, family: family.name, year });

    result.push(bikes);
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

const cacheFamily = async (root, brand) => {
  const brandDataDirectory = `${root}/data/${brand}`;
  if (!fs.existsSync(brandDataDirectory)) {
    fs.mkdirSync(brandDataDirectory);
  }

  if (fs.existsSync(`${brandDataDirectory}/families.json`)) {
    return require(`${brandDataDirectory}/families.json`);
  }

  console.log('Retrieve families...');
  const families = await getFamilies(brand);

  fs.writeFileSync(
    `${brandDataDirectory}/families.json`,
    JSON.stringify(families),
  );

  return families;
};

const cacheBikes = async (root, brand) => {
  const brandDataDirectory = `${root}/data/${brand}`;
  if (!fs.existsSync(brandDataDirectory)) {
    fs.mkdirSync(brandDataDirectory);
  }

  if (fs.existsSync(`${brandDataDirectory}/bikes.json`)) {
    return require(`${brandDataDirectory}/bikes.json`);
  }

  const families = await cacheFamily(root, brand);

  console.log('Retrieve bikes for families...');
  const bikes = [];
  for (const family of families) {
    const familyBikes = await getBikesForBrandFamilyWithYear(brand, family);
    bikes.push(familyBikes);
  }

  fs.writeFileSync(`${brandDataDirectory}/bikes.json`, JSON.stringify(bikes));

  return bikes;
};

const run = async () => {
  const root = path.resolve(__dirname, '..');

  const brand = 'Cannondale';
  const bikes = await cacheBikes(root, brand);

  const brandDirectory = `${root}/images/${brand}`;
  if (!fs.existsSync(brandDirectory)) {
    fs.mkdirSync(brandDirectory);
  }

  bikes
    .flatMap((b) => b)
    .filter((bike) => bike.imageSrc != null)
    .forEach(async ({ name, family, year, imageSrc }) => {
      const familyDirectory = `${brandDirectory}/${family.replace(/\//g, '__')}`;
      if (!fs.existsSync(familyDirectory)) {
        fs.mkdirSync(familyDirectory);
      }
      const yearDirectory = `${familyDirectory}/${year}`;
      if (!fs.existsSync(yearDirectory)) {
        fs.mkdirSync(yearDirectory);
      }

      let extension = imageSrc.split('.').pop();
      if (!['jpeg', 'jpg', 'png', 'webp'].includes(extension.toLowerCase())) {
        console.log(`Unknown extension for ${name} - ${extension}`);
        return;
      }
      const dest = `${yearDirectory}/${name.replace(/\//g, '__')}.${extension}`;
      try {
        await downloadImageFromUrl(imageSrc, dest);
      } catch (e) {
        console.error(`Failed to download image for ${name} - ${e}`);
      }
    });
};

run();
