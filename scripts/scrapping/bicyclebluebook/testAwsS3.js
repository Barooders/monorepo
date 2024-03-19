const AWS = require('aws-sdk');
const fs = require('node:fs');
const path = require('path');
const { readdirSync } = require('fs');

const root = path.resolve(__dirname, '..');
const PATH_PREFIX = 'private/bicyclebluebook';

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const getFiles = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);

const uploadFile = (fileName) => {
  const fileContent = fs.readFileSync(fileName);
  const key =
    PATH_PREFIX +
    fileName.replace(
      '/Users/clementdessoude/Documents/dev/barooders/monorepo/scripts/scrapping/data/',
      '/data/',
    );

  const params = {
    Bucket: 'barooders-s3-bucket',
    Key: key,
    Body: fileContent,
  };

  s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
};

const sleep = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const uploadGiantFiles = async () => {
  const giantPath = path.resolve(root, 'data', 'Giant');

  const directories = getDirectories(giantPath);
  for (const directory of directories) {
    const yearDirectories = getDirectories(path.resolve(giantPath, directory));
    for (const yearDirectory of yearDirectories) {
      const files = getFiles(path.resolve(giantPath, directory, yearDirectory));
      for (const file of files) {
        uploadFile(path.resolve(giantPath, directory, yearDirectory, file));
        await sleep(500);
      }
    }
  }
};

uploadGiantFiles();
