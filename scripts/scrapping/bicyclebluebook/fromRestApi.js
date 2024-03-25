const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const baseUrl = 'https://api.bicyclebluebook.com/vg/api/brand/year/model';

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const BUCKET_NAME = 'barooders-s3-bucket';
const PATH_PREFIX = 'private/bicyclebluebook';

const brandsByPriority = {
  'BH Bikes': 1,
  Bianchi: 1,
  BMC: 1,
  Cannondale: 1,
  Canyon: 1,
  Cervelo: 1,
  Colnago: 1,
  Commencal: 1,
  Corima: 1,
  'Cube Bikes': 1,
  'Factor Bikes': 1,
  Focus: 1,
  Giant: 1,
  Haibike: 1,
  Lapierre: 1,
  Liv: 1,
  Look: 1,
  Merida: 1,
  Orbea: 1,
  Pinarello: 1,
  Raleigh: 1,
  Scott: 1,
  Specialized: 1,
  Vision: 1,
  'Santa Cruz': 1,
  Basso: 2,
  Berria: 2,
  Ceepo: 2,
  Cinelli: 2,
  'De Rosa': 2,
  Decathlon: 2,
  Felt: 2,
  Ghost: 2,
  Guerciotti: 2,
  Peugeot: 2,
  'Planet-X': 2,
  Ritchey: 2,
  'Parlee Cycles': 2,
  'Sun Bicycles': 2,
  Sunn: 2,
  'Gazelle Bikes': 2,
  Breezer: 3,
  Bulls: 3,
  Fuji: 3,
  Kona: 3,
  Motobecane: 3,
  'Neo Bicycles': 3,
  'NS Bikes': 3,
  Pegasus: 3,
  Stromer: 3,
  Vitus: 3,
  '3T': 3,
  Banshee: 3,
  Batavus: 3,
  Bontrager: 3,
  Borealis: 3,
  Bottecchia: 3,
  Bridgestone: 3,
  Norco: 3,
  'Stevens Bikes': 3,
  '2-Hip': 4,
  '3G Bikes': 4,
  abici: 4,
  Adams: 4,
  Aegis: 4,
  'Aero-Fast': 4,
  Airborne: 4,
  'Airo-Series': 4,
  'Alex Moulton': 4,
  'All-City': 4,
  Alliant: 4,
  'Alpha Bicycles': 4,
  'Alpine Designs': 4,
  Alpinestars: 4,
  'American Flyer': 4,
  'AMP Research': 4,
  Angletech: 4,
  Areaware: 4,
  Auburn: 4,
  AutoBike: 4,
  Bacchetta: 4,
  Balance: 4,
  Barracuda: 4,
  'Batch Bicycles': 4,
  Battle: 4,
  'Benno Bikes': 4,
  'Beyond Fabrications': 4,
  'Big Cat HPV': 4,
  BikeE: 4,
  'Bilda Bike': 4,
  Bilenky: 4,
  'Bintelli Bicycles': 4,
  Bionicon: 4,
  'Black Ops': 4,
  BLT: 4,
  Blue: 4,
  Boulder: 4,
  Bouncer: 4,
  BREW: 4,
  Brodie: 4,
  Brompton: 4,
  'Brooklyn Bicycle Co.': 4,
  'Bruce Gordon': 4,
  'Buddy Bike': 4,
  Budnitz: 4,
  Bully: 4,
  Burley: 4,
  'Burro Bikes': 4,
  Cadillac: 4,
  'Calfee Design': 4,
  Caloi: 4,
  Carrera: 4,
  Casati: 4,
  Catamount: 4,
  Catrike: 4,
  Cayne: 4,
  'Charge Bikes': 4,
  'Cherry Bicycles': 4,
  Chumba: 4,
  Cignal: 4,
  Ciocc: 4,
  Civia: 4,
  'Clark-Kent': 4,
  Cleary: 4,
  COBO: 4,
  Cogburn: 4,
  Coker: 4,
  Columbia: 4,
  CoMotion: 4,
  'Co-Motion': 4,
  Condor: 4,
  Conejo: 4,
  'Co-op Cycles': 4,
  Counterpoint: 4,
  'Crankin Cycles': 4,
  'Creme Cycles': 4,
  'Cresswell Engineering': 4,
  'Crestone Peak': 4,
  Croll: 4,
  Crosstrac: 4,
  Cult: 4,
  Currie: 4,
  Curve: 4,
  'Cycle Genius': 4,
  'Cycle Kids Bikes': 4,
  'Cycle Pro': 4,
  'Da Bomb': 4,
  'da Vinci Designs': 4,
  Dahon: 4,
  'Dan/Ed': 4,
  'Day 6 Bicycles': 4,
  'De Bernardi': 4,
  Dean: 4,
  Dekerf: 4,
  'Del Sol': 4,
  Denago: 4,
  Devinci: 4,
  Diamondback: 4,
  'Dirt Research': 4,
  Dirtmaster: 4,
  DK: 4,
  Dragonfly: 4,
  Dyno: 4,
  'Eastern Bikes': 4,
  'Easy Racer': 4,
  'Eddy Merckx': 4,
  eFlow: 4,
  Electra: 4,
  Elf: 4,
  Elite: 4,
  Ellsworth: 4,
  'Emojo Bike': 4,
  EPX: 4,
  ETC: 4,
  'Evil Bikes': 4,
  Evo: 4,
  'EZ-bike': 4,
  Fabweld: 4,
  Fairdale: 4,
  Faraday: 4,
  'Fat City Cycles': 4,
  FBM: 4,
  'Feather Titanium': 4,
  Fiction: 4,
  Fiore: 4,
  'Fireman’s': 4,
  Fisher: 4,
  'Fit Bike Co.': 4,
  Foundry: 4,
  'Free Agent': 4,
  'Freedom Concepts': 4,
  'Freedom Ryder': 4,
  'Frog Bikes': 4,
  Fyxation: 4,
  Gaansari: 4,
  Garneau: 4,
  'Gary Fisher': 4,
  Genius: 4,
  Giordana: 4,
  Globe: 4,
  Gocycle: 4,
  Gonzo: 4,
  Grandis: 4,
  'Green Cycles': 4,
  Greenspeed: 4,
  Griffen: 4,
  Grisley: 4,
  GT: 4,
  Guardian: 4,
  Guerber: 4,
  Gunnar: 4,
  Guru: 4,
  Habit: 4,
  Haluzak: 4,
  'Hampton Cruiser': 4,
  Hanebrink: 4,
  'Hang Ten': 4,
  Haro: 4,
  Hase: 4,
  Haven: 4,
  Hawk: 4,
  Heller: 4,
  'HH Racing Group': 4,
  'High Zoot': 4,
  Hoffman: 4,
  Holiday: 4,
  Hotta: 4,
  'HP Velotechnik': 4,
  Husky: 4,
  'Hyper Bicycles': 4,
  'I.C.E.': 4,
  Ibis: 4,
  'Ice Trikes': 4,
  'Independent Fabrication': 4,
  Infinity: 4,
  'Intense Cycles': 4,
  Ionic: 4,
  'Iron Horse': 4,
  IZIP: 4,
  Jade: 4,
  Jamis: 4,
  Jazz: 4,
  Jeep: 4,
  Joyride: 4,
  Juliana: 4,
  'Just Two Bikes': 4,
  'Just-Go Scooters': 4,
  K2: 4,
  Kazam: 4,
  Kestrel: 4,
  KHE: 4,
  KHS: 4,
  Kingcycle: 4,
  Kink: 4,
  Klein: 4,
  Kuota: 4,
  'Kustom Kruiser': 4,
  Lafleche: 4,
  'Land Shark': 4,
  'Lee Cougan': 4,
  Legacy: 4,
  LeMond: 4,
  'Lenz Sport': 4,
  Lightning: 4,
  Linear: 4,
  Linus: 4,
  Litespeed: 4,
  'Living Extreme': 4,
  Liyang: 4,
  LOCOMotion: 4,
  Lodestar: 4,
  Longbikes: 4,
  Lotus: 4,
  'Louis Garneau': 4,
  'Lovely Lowrider': 4,
  'Lynskey Performance': 4,
  Macalu: 4,
  'Magnum Bikes': 4,
  Mandaric: 4,
  Manhattan: 4,
  Marin: 4,
  Marinoni: 4,
  Masi: 4,
  Maverick: 4,
  Maxam: 4,
  Maxcycles: 4,
  MCS: 4,
  Medici: 4,
  'Mercedes-Benz': 4,
  Meridian: 4,
  Merlin: 4,
  Mezzo: 4,
  'Miami Sun': 4,
  Miele: 4,
  Mikado: 4,
  Mirage: 4,
  Mirraco: 4,
  Miyata: 4,
  Mohawk: 4,
  Momentum: 4,
  Mondonico: 4,
  Mongoose: 4,
  Montague: 4,
  Monty: 4,
  Moots: 4,
  Moser: 4,
  Mosh: 4,
  Motiv: 4,
  'Motiv Electric Bikes': 4,
  'Mountain Cycle': 4,
  'Mountain Goat': 4,
  'Mountain Sport': 4,
  'Mountain Tek': 4,
  'Moving Violations': 4,
  Mrazek: 4,
  'Mt. Shasta': 4,
  'MTN TEK': 4,
  Nashbar: 4,
  'New Sense': 4,
  Niner: 4,
  Nirve: 4,
  Nishiki: 4,
  Nordic: 4,
  'North Star': 4,
  Novara: 4,
  Nytro: 4,
  Ochsner: 4,
  Olmo: 4,
  Opus: 4,
  Orange: 4,
  Origin8: 4,
  Oryx: 4,
  Ostrad: 4,
  'Otis Guy': 4,
  Outback: 4,
  Outland: 4,
  Pace: 4,
  Parkpre: 4,
  Pashley: 4,
  'PB Derailleur': 4,
  Pedalcraft: 4,
  Penninger: 4,
  Performance: 4,
  'Phat Cycles': 4,
  'Phil Wood': 4,
  'Piper Pittbikes': 4,
  'Pivot Cycles': 4,
  Pogliaghi: 4,
  'Populo Bikes': 4,
  Porsche: 4,
  Porter: 4,
  Powercurve: 4,
  Powerlite: 4,
  Premium: 4,
  'Primal Wear': 4,
  ProFlex: 4,
  'Psycle Werks': 4,
  'Pure Cycles': 4,
  'Pure Fix Cycles': 4,
  Pyramid: 4,
  Python: 4,
  Quadracycle: 4,
  Quantum: 4,
  Quetzal: 4,
  QuietKat: 4,
  'Quintana Roo': 4,
  'Race Team Ross': 4,
  Radio: 4,
  Radius: 4,
  'Raleigh Electric': 4,
  Rans: 4,
  ReBike: 4,
  'Red Hot': 4,
  Redline: 4,
  Reid: 4,
  'Research Dynamics': 4,
  Retrospec: 4,
  Revenge: 4,
  'Revere Bicycles': 4,
  Rhygin: 4,
  'Richard Sachs': 4,
  Ridley: 4,
  Rivendell: 4,
  Robinson: 4,
  'Rocky Mountain': 4,
  Rodriguez: 4,
  Roland: 4,
  'Roll: Bicycle Company': 4,
  Romic: 4,
  Ross: 4,
  Rotator: 4,
  Rotec: 4,
  'Royce Union': 4,
  Ruption: 4,
  Ryan: 4,
  'S & B Recumbent': 4,
  'S & M': 4,
  'Saint Marks': 4,
  SainTropez: 4,
  Salsa: 4,
  Sampson: 4,
  Santana: 4,
  'Scoot and Ride': 4,
  Scorpio: 4,
  'Screaming Metal Cycles': 4,
  'SE Racing': 4,
  'Serfas E-Bikes': 4,
  'Serial 1': 4,
  Serotta: 4,
  'Seven Cycles': 4,
  Shogun: 4,
  Signature: 4,
  'Simo Cycles': 4,
  Simoncini: 4,
  Slingshot: 4,
  Softride: 4,
  Soma: 4,
  Sombrio: 4,
  Spectra: 4,
  Spectrum: 4,
  Spit: 4,
  Spooky: 4,
  Spot: 4,
  'Star Cruiser': 4,
  'State Bicycle Co': 4,
  Steelman: 4,
  Sterling: 4,
  Stolen: 4,
  'Store-Branded': 4,
  'Storm Racing Cycles': 4,
  'Strider Sports': 4,
  Subrosa: 4,
  'Sun Seeker': 4,
  Sunday: 4,
  Supercross: 4,
  'Supercross BMX': 4,
  Supergo: 4,
  Surly: 4,
  Swift: 4,
  'Swiss Army': 4,
  Swobo: 4,
  Tech: 4,
  Tern: 4,
  TerraTrike: 4,
  Terry: 4,
  'TH!NK Bike': 4,
  Thebis: 4,
  'Thruster BMX Bicycle Co.': 4,
  'Ti Cycles': 4,
  Timberlin: 4,
  Time: 4,
  Titan: 4,
  'Titan Bicycles': 4,
  Titus: 4,
  'Titus by Zenital': 4,
  TNT: 4,
  Tomac: 4,
  Tommaso: 4,
  Torelli: 4,
  Torker: 4,
  Trailmate: 4,
  Transition: 4,
  Trek: 4,
  'Tribe Bicycle Co.': 4,
  'Trophy Products': 4,
  Tuesday: 4,
  'Turner Bikes': 4,
  'Turner Enterprises': 4,
  'Two “O” Delta Three': 4,
  Ultimax: 4,
  United: 4,
  Univega: 4,
  'Univega USA': 4,
  'Urban Arrow': 4,
  'USPD-Montague': 4,
  'VAAST Bikes': 4,
  'Valley Cycles': 4,
  'Van Dessel Cycles': 4,
  'Velo Solex Motorbike': 4,
  Ventana: 4,
  Ventura: 4,
  'Volume Bikes': 4,
  VooDoo: 4,
  WallerAng: 4,
  Waterford: 4,
  'Western Flyer': 4,
  WeThePeople: 4,
  Wheeler: 4,
  Whyte: 4,
  'Wilier Triestina': 4,
  Windcheetah: 4,
  'Windy City': 4,
  WizWheelz: 4,
  'Wolf Creek': 4,
  Worksman: 4,
  Wynn: 4,
  XDS: 4,
  'X-Lab': 4,
  Yamaha: 4,
  'Yellow Bike': 4,
  'Yellow Mushroom': 4,
  'Yeti Cycles': 4,
  Yokota: 4,
  Yuba: 4,
  'Yuba Bicycles': 4,
  Zephyr: 4,
  ZeroBike: 4,
  Zinc: 4,
};

const minYear = 2016;

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

const downloadImageFromUrl = async (url, dest) => {
  if (await doesFileExist(dest)) {
    return;
  }

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
    if (year < minYear) {
      console.log(`Skipping year ${year}`);
      continue;
    }

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

const additionalInfo = async (bike, brand, brandId) => {
  const data = await fetch(
    `https://api.bicyclebluebook.com/core/api/tradeIn/bicycle?brandId=${brandId}&modelId=${bike.modelId}&yearId=${bike.year}`,
  );
  const body = await data.json();
  return {
    ...bike,
    ...body,
  };
};

const cacheAdditionalInfo = async (brand, brandId, bike) => {
  const brandDataDirectory = `${PATH_PREFIX}/data/${escape(brand)}`;
  const familiesDataDirectory = `${brandDataDirectory}/${escape(bike.family)}`;
  const yearDirectory = `${familiesDataDirectory}/${bike.year}`;

  const fileName = `${yearDirectory}/${escape(bike.name)}.json`;
  if (await doesFileExist(fileName)) {
    return getObjectContent(fileName);
  }

  console.log(`Retrieve info on product ${bike.name}...`);
  const more = await additionalInfo(bike, brand, brandId);

  uploadFile(fileName, JSON.stringify(more));
  return more;
};

const escape = (str) => str.replace(/\//g, '__');

async function getImages(brand, bikes) {
  const brandDirectory = `${PATH_PREFIX}/images/${brand}`;

  const bikesWithImages = bikes.filter((bike) => bike.imageSrc != null);
  const chunkedBikes = chunkArray(bikesWithImages, 30);

  console.log(`Downloading ${bikesWithImages.length} images...`);
  let i = 0;
  for (const chunk of chunkedBikes) {
    console.log(`Downloading chunk ${i++}...`);
    await Promise.all(
      chunk.map(async ({ name, family, year, imageSrc }) => {
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
      }),
    );
  }
}

const chunkArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

const getBrandInformations = async () => {
  const brandDataFile = `${PATH_PREFIX}/data/brandData.json`;
  if (await doesFileExist(brandDataFile)) {
    return getObjectContent('data/brandData.json');
  }

  console.log('Retrieve brand informations...');
  const data = await fetch(
    `https://api.bicyclebluebook.com/vg/api/bicycleSearch/baseComponent`,
  );
  const body = await data.json();

  uploadFile(brandDataFile, JSON.stringify(body));
  return body;
};

async function scrapBrand({ brandName, brandId }) {
  console.log(`Scraping ${brandName}...`);
  const completedFile = `${PATH_PREFIX}/data/${brandName}/completed.txt`;
  if (await doesFileExist(completedFile)) {
    console.log(`${brandName} already scraped !`);
    return;
  }

  const simpleBikes = (await cacheBikes(brandName)).flatMap((b) => b);

  const bikes = [];
  for (const bike of simpleBikes) {
    try {
      bikes.push(await cacheAdditionalInfo(brandName, brandId, bike));
    } catch (e) {
      console.error(`Failed to cache additional info for ${bike.name} - ${e}`);
    }
  }

  console.log('Downloading images...');
  await getImages(brandName, simpleBikes);

  uploadFile(completedFile, 'completed !');
}

const run = async () => {
  const { bicycleBrands: brands } = await getBrandInformations();

  const orderedBrands = brands.sort((one, two) => {
    const priorityOne = brandsByPriority[one.name];
    const priorityTwo = brandsByPriority[two.name];

    return priorityOne - priorityTwo;
  });

  for (const brand of orderedBrands) {
    await scrapBrand({ brandName: brand.name, brandId: brand.id });
  }
};

run();
