const { glob } = require('glob');
const path = require('path');

const checkDependencies = (packageJsonFile) => {
  const packageJson = require(packageJsonFile);
  const { dependencies = {}, devDependencies = {} } = packageJson;

  const areAllDependenciesFixed =
    Object.entries(dependencies).every(hasFixedDependency);
  const areAllDevDependenciesFixed =
    Object.entries(devDependencies).every(hasFixedDependency);

  if (!areAllDependenciesFixed || !areAllDevDependenciesFixed) {
    console.error(`Some dependencies are not fixed for ${packageJsonFile}`);
    return false;
  }

  return true;
};

const hasFixedDependency = ([name, version]) => {
  const isNotFixed = version.includes('^') || version.includes('~');

  if (isNotFixed) {
    console.error(`⚠️  Dependency ${name} has unfixed version ${version}`);
  }

  return !isNotFixed;
};

const run = async () => {
  const root = path.resolve(__dirname, '../..');
  const files = await glob([`${root}/**/package.json`], {
    ignore: [
      root + '/**/node_modules/**',
      root + '/**/dist/**',
      root + '/**/__generated/**',
    ],
  });

  let areAllOk = true;
  files.forEach((file) => {
    console.log(`Checking ${file}...`);
    const isOk = checkDependencies(file);

    if (!isOk) {
      areAllOk = false;
    }
  });

  if (!areAllOk) {
    process.exit(1);
  }
};

run();
