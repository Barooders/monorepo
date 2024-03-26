const fetch = require('node-fetch');
const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const BUCKET_NAME = 'barooders-s3-bucket';
const PATH_PREFIX = 'private/buycycle';

const priorityBrands = [
  // 'ktm',
  // 'fantic',
  // 'moustache',
  // 'kalkhoff',
  // 'gitane',
  // 'basso',
  // 'mondraker',
  'riese-muller',
  'time',
  'whistle',
  'lee-cougan',
  'gasgas',
];

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

const getImages = async (bikes) => {
  for (const bike of bikes) {
    if (bike.image == null) {
      console.log('No image for bike', JSON.stringify(bike));
      continue;
    }
    await downloadImageFromUrl(
      bike.image.file_url,
      `${PATH_PREFIX}/images/${bike.image.file_name}`,
    );
    await sleep(100);
  }
};

const scrapBikesForFamilyAndPage = async ({
  familyId,
  familySlug,
  brandSlug,
  page,
}) => {
  const documentId = `${PATH_PREFIX}/data/bikes/${brandSlug}/${familySlug}/${page}.json`;

  if (await doesFileExist(documentId)) {
    return getObjectContent(documentId);
  }

  const url = `https://buycycle.com/fr-fr/sell/get-content?sort_by=year_max&page=${page}&family_id=${familyId}`;
  const data = await fetch(url);
  const body = await data.json();

  uploadFile(documentId, JSON.stringify(body));
  await sleep(400);

  return body;
};

const scrapAllBikesForFamily = async ({ familyId, familySlug, brandSlug }) => {
  const completedFile = `${PATH_PREFIX}/data/bikes/${brandSlug}/${familySlug}/completed.txt`;
  if (await doesFileExist(completedFile)) {
    console.log(`${familySlug} for ${brandSlug} already scraped !`);
    return;
  }

  let page = 1;
  let isLastPage = false;

  while (!isLastPage) {
    console.log(`Scraping page ${page} for ${familySlug}`);
    const data = await scrapBikesForFamilyAndPage({
      familyId,
      familySlug,
      brandSlug,
      page,
    });

    await getImages(data.data);

    const lastPage = data.last_page;
    isLastPage = page === lastPage;
    page++;
  }

  uploadFile(completedFile, 'completed !');
};

const scrapFamilyPage = async (page) => {
  const documentId = `${PATH_PREFIX}/data/common/families-${page}.json`;

  if (await doesFileExist(documentId)) {
    return getObjectContent(documentId);
  }

  const url = `https://buycycle.com/fr-fr/sell/get-content?sort_by=year_max&page=${page}&isFiltersChange=true`;
  const data = await fetch(url);
  const body = await data.json();

  uploadFile(documentId, JSON.stringify(body));
  await sleep(500);

  return body;
};

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const scrapAllFamilies = async () => {
  const families = [];
  let page = 1;
  const lastPage = 266;

  while (page <= lastPage) {
    console.log(`Scraping page ${page}`);
    const data = await scrapFamilyPage(page);
    families.push(...data.data);
    page++;
  }

  return families;
};

const getAllFamilies = async () => {
  const documentId = `${PATH_PREFIX}/data/common/families.json`;

  if (await doesFileExist(documentId)) {
    return getObjectContent(documentId);
  }

  const families = await scrapAllFamilies();

  for (const family of families) {
    if (family.brand == null) {
      console.log(JSON.stringify(family));
    }
  }

  const data = families.map((family) => ({
    id: family.id,
    slug: family.slug,
    brandSlug: family.brand?.slug,
  }));

  uploadFile(documentId, JSON.stringify(data));
  return data;
};

const scrapAll = async () => {
  const families = await getAllFamilies();

  // const orderedFamilies = families.sort((a, b) => {
  //   if (
  //     priorityBrands.includes(a.brandSlug) &&
  //     !priorityBrands.includes(b.brandSlug)
  //   ) {
  //     return -1;
  //   }
  //   if (
  //     !priorityBrands.includes(a.brandSlug) &&
  //     priorityBrands.includes(b.brandSlug)
  //   ) {
  //     return 1;
  //   }
  //   return 0;
  // });

  const orderedFamilies = families.filter((f) =>
    priorityBrands.includes(f.brandSlug),
  );

  for (const family of orderedFamilies) {
    if (family.brandSlug == null) {
      continue;
    }
    console.log(`Scraping ${family.slug} for ${family.brandSlug}`);
    await scrapAllBikesForFamily({
      familyId: family.id,
      familySlug: family.slug,
      brandSlug: family.brandSlug,
    });
  }
};

const run = async () => {
  await scrapAll();
};

run();
