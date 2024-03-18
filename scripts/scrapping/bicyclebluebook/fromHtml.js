const fs = require('node:fs');
const path = require('path');
const { load } = require('cheerio');
const fetch = require('node-fetch');

const getBikeName = (appCard) => {
  return appCard.find('a').contents().text().trim();
};

const getImageUrl = (appCard) => {
  const imageUrlRaw = appCard.find('img[alt="image-product"]').attr('src');
  const imageUrl = new URL('https://www.bicyclebluebook.com' + imageUrlRaw);

  return imageUrl.searchParams.get('url').replace('small', 'original');
};

const retrieveImage = (data) => {
  const $ = load(data, null, false);
  const image = $('.app-card');
  console.log(image);

  return {
    bikeName: getBikeName(image),
    imageUrl: getImageUrl(image),
  };
};

const downloadImageFromUrl = async (url, dest) => {
  const response = await fetch(url);
  const buffer = await response.buffer();

  fs.writeFileSync(dest, buffer);
};

const run = async () => {
  const root = path.resolve(__dirname, '..');
  const data = fs.readFileSync(`${root}/test.html`, 'utf8');

  // const url =
  //   'https://www.bicyclebluebook.com/value-guide/Cannondale/1FG/?yearId=2004';
  // const response = await fetch(url);
  // const data = await response.text();
  // console.log(data);

  const { bikeName, imageUrl } = retrieveImage(data);
  const directory = `${root}/images`;

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory);
  }

  const dest = `${directory}/${bikeName}.jpg`;

  await downloadImageFromUrl(imageUrl, dest);
};

run();
