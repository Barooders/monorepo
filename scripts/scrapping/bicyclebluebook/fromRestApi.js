const fs = require('node:fs');
const path = require('path');
const fetch = require('node-fetch');

const baseUrl = 'https://api.bicyclebluebook.com/vg/api/brand/year/model';

const downloadImageFromUrl = async (url, dest) => {
  const response = await fetch(url);
  const buffer = await response.buffer();

  fs.writeFileSync(dest, buffer);
};

const getYears = async (brand, family) => {
  const data = await fetch(
    `${baseUrl}?brandId=&brandName=${brand}&familyName=${family}`,
  );
  const body = await data.json();
  const years = body.years.map((year) => year.id);

  return years;
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

async function getBikesForBrandFamily(brand, family) {
  const years = await getYears(brand, family);
  const bikes = (
    await Promise.all(
      years.map(async (year) => {
        const bikes = await getBikeForYear({ brand, family, year });
        return bikes;
      }),
    )
  ).flatMap((bikes) => bikes);
  return bikes;
}

async function getBikesForBrandFamilyWithYear(brand, family) {
  const result = [];
  for (const year of family.years) {
    console.log(`Getting bikes for family ${family.name} and year ${year}`);
    const bikes = await getBikeForYear({ brand, family: family.name, year });

    result.push(bikes);
  }
  return result.flatMap((bikes) => bikes);
}

const getFamilies = async (brandId) => {
  const data = await fetch(
    `https://api.bicyclebluebook.com/vg/api/model/families?brandId=${brandId}`,
  );
  const body = await data.json();
  const families = body.map((family) => ({
    name: family.familyName,
    years: family.years.map((year) => year.id),
  }));

  return families;
};

const run = async () => {
  const root = path.resolve(__dirname, '..');

  const brand = 'Specialized';
  const brandId = 741;
  // const family = '1FG';

  // const families = await getFamilies(brandId);

  // const brandDataDirectory = `${root}/data/${brand}`;
  // if (!fs.existsSync(brandDataDirectory)) {
  //   fs.mkdirSync(brandDataDirectory);
  // }
  // fs.writeFileSync(
  //   `${brandDataDirectory}/families.json`,
  //   JSON.stringify(families),
  // );

  // console.log(families);

  // const bikes = [];
  // for (const family of families) {
  //   const familyBikes = await getBikesForBrandFamilyWithYear(brand, family);
  //   bikes.push(familyBikes);
  // }
  // fs.writeFileSync(`${brandDataDirectory}/bikes.json`, JSON.stringify(bikes));
  const bikes = require(root + '/data/Specialized/bikes.json');

  const brandDirectory = `${root}/images/${brand}`;
  if (!fs.existsSync(brandDirectory)) {
    fs.mkdirSync(brandDirectory);
  }

  bikes
    .flatMap((b) => b)
    .filter((bike) => bike.imageSrc != null)
    .forEach(async ({ name, family, year, imageSrc }) => {
      const familyDirectory = `${brandDirectory}/${family}`;
      if (!fs.existsSync(familyDirectory)) {
        fs.mkdirSync(familyDirectory);
      }
      const yearDirectory = `${familyDirectory}/${year}`;
      if (!fs.existsSync(yearDirectory)) {
        fs.mkdirSync(yearDirectory);
      }

      const extension = imageSrc.split('.').pop();
      const dest = `${yearDirectory}/${name}.${extension}`;
      try {
        await downloadImageFromUrl(imageSrc, dest);
      } catch (e) {
        console.error(`Failed to download image for ${name} - ${e}`);
      }
    });
};

run();
