const fs = require('node:fs');
const path = require('path');
const fetch = require('node-fetch');
const { readdirSync } = require('fs');

const baseUrl = 'https://api.bicyclebluebook.com/vg/api/brand/year/model';
const root = path.resolve(__dirname, '..');

const BRAND_IDs = {
  Specialized: 741,
  Cannondale: 672,
  Giant: 683,
};

const downloadImageFromUrl = async (url, dest) => {
  const response = await fetch(url);
  const buffer = await response.buffer();

  fs.writeFileSync(dest, buffer);
};

const getBikeForYear = async ({ brand, family, year }) => {
  const root = path.resolve(__dirname, '..');

  const brandDataDirectory = `${root}/data/${escape(brand)}`;
  createDirectoryIfNotExists(brandDataDirectory);

  const familiesDataDirectory = `${brandDataDirectory}/${escape(family)}`;
  createDirectoryIfNotExists(familiesDataDirectory);

  const yearDirectory = `${familiesDataDirectory}/${year}`;
  createDirectoryIfNotExists(yearDirectory);

  const fileName = `${yearDirectory}/simple-bikes.json`;
  if (fs.existsSync(fileName)) {
    return require(fileName);
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

  fs.writeFileSync(fileName, JSON.stringify(bikes));
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

const cacheAdditionalInfo = async (root, brand, bike) => {
  const brandDataDirectory = `${root}/data/${escape(brand)}`;
  createDirectoryIfNotExists(brandDataDirectory);

  const familiesDataDirectory = `${brandDataDirectory}/${escape(bike.family)}`;
  createDirectoryIfNotExists(familiesDataDirectory);

  const yearDirectory = `${familiesDataDirectory}/${bike.year}`;
  createDirectoryIfNotExists(yearDirectory);

  const fileName = `${yearDirectory}/${escape(bike.name)}.json`;
  if (fs.existsSync(fileName)) {
    return require(fileName);
  }

  console.log(`Retrieve info on product ${bike.name}...`);
  const more = await additionalInfo(bike, brand);

  fs.writeFileSync(fileName, JSON.stringify(more));

  return more;
};

const createDirectoryIfNotExists = (path) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};
const escape = (str) => str.replace(/\//g, '__');

function getImages(root, brand, bikes) {
  const brandDirectory = `${root}/images/${brand}`;
  if (!fs.existsSync(brandDirectory)) {
    fs.mkdirSync(brandDirectory);
  }

  bikes
    .filter((bike) => bike.imageSrc != null)
    .forEach(async ({ name, family, year, imageSrc }) => {
      const familyDirectory = `${brandDirectory}/${escape(family)}`;
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
      const dest = `${yearDirectory}/${escape(name)}.${extension}`;
      try {
        await downloadImageFromUrl(imageSrc, dest);
      } catch (e) {
        console.error(`Failed to download image for ${name} - ${e}`);
      }
    });
}

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getFiles = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

const clear = () => {
  const brandDirectory = `${root}/data/Giant`;

  getDirectories(brandDirectory).forEach((family) => {
    const familyDirectory = `${brandDirectory}/${family}`;
    getDirectories(familyDirectory).forEach((year) => {
      const yearDirectory = `${familyDirectory}/${year}`;
      const simpleBikes = require(`${yearDirectory}/simple-bikes.json`);

      if (simpleBikes.length === 0) {
        console.log(`Undefined simple-bikes.json in ${yearDirectory}`);
        return;
      }

      if (simpleBikes[0].modelId == null) {
        // Delete file
        console.log(`Deleting ${yearDirectory}/simple-bikes.json`);
        fs.unlinkSync(`${yearDirectory}/${file}`);
      }
      getFiles(yearDirectory)
        .filter((file) => file !== 'simple-bikes.json')
        .forEach((file) => {
          const data = require(`${yearDirectory}/${file}`);
          if (data.errorCode != null) {
            // Delete file
            console.log(`Deleting ${yearDirectory}/${file}`);
            fs.unlinkSync(`${yearDirectory}/${file}`);
          }
        });
    });
  });
};

const run = async () => {
  const brand = 'Giant';
  const simpleBikes = (await cacheBikes(root, brand)).flatMap((b) => b);

  const bikes = [];
  for (const bike of simpleBikes) {
    try {
      bikes.push(await cacheAdditionalInfo(root, brand, bike));
    } catch (e) {
      console.error(`Failed to cache additional info for ${bike.name} - ${e}`);
    }
  }

  console.log('Downloading images...');
  getImages(root, brand, bikes);
};

run();

const check = () => {
//   const brandDirectory = `${root}/data/Giant`;

//   getDirectories(brandDirectory).forEach((family) => {
//     const familyDirectory = `${brandDirectory}/${family}`;
//     getDirectories(familyDirectory).forEach((year) => {
//       const yearDirectory = `${familyDirectory}/${year}`;
//       getFiles(yearDirectory)
//         .filter((file) => file !== 'simple-bikes.json')
//         .forEach((file) => {
//           const data = require(`${yearDirectory}/${file}`);
//           if (data.components == null) {
//             console.log(`wrong ${yearDirectory}/${file}`);
//           }
//         });
//     });
//   });
// };

// clear();
