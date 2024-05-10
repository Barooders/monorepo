import inquirer from "inquirer";
import { execSync } from "child_process";

const execQuietCommand = command => execSync(command, { stdio: "pipe" });

const mapEnvToApp = {
  production: "barooders-strapi",
  staging: "barooders-strapi-staging",
};

const askEnvironment = () =>
  inquirer
    .prompt([
      {
        type: "list",
        name: "environment",
        message: "What database sohuld we sync?",
        choices: ["production", "staging"],
      },
    ])
    .then(({ environment }) => environment)
    .catch(globalErrorHandling);

const askRefreshDump = localDumpDate =>
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "shouldUpdateDump",
        message: `Local dump created on ${new Date(localDumpDate).toLocaleDateString()}, should we update it?`,
      },
    ])
    .then(({ shouldUpdateDump }) => shouldUpdateDump)
    .catch(globalErrorHandling);

const getDumpPath = envName => `./database/dumps/${envName}.dump`;

const getLocalDumpDate = envName => execQuietCommand(`GIT_PAGER=cat git log -1 --format=%cd ${getDumpPath(envName)}`);

const refreshDump = async envName => {
  const appName = mapEnvToApp[envName];

  execSync(`heroku pg:backups:capture --app ${appName}`, { stdio: "inherit" });
  execSync(`heroku pg:backups:download --app ${appName} --output ${getDumpPath(envName)}`, { stdio: "inherit" });
};

const cleanDatabase = async () => {
  execSync(
    "docker-compose exec -u postgres barooders-strapiDB psql barooders-cms -c 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;'",
    { stdio: "inherit" }
  );
};

const loadDump = async envName => {
  execSync(
    `PGPASSWORD=password pg_restore --no-owner -h localhost -p 2346 -U postgres -d barooders-cms ${getDumpPath(
      envName
    )}`,
    { stdio: "inherit" }
  );
};

const globalErrorHandling = error => {
  if (error.isTtyError) {
    throw new Error("Could not be rendered in the current environment");
  } else {
    throw new Error(`Sorry the script did not work: ${error}`);
  }
};

const run = async () => {
  const env = await askEnvironment();

  const localDumpDate = getLocalDumpDate(env);
  const shouldUpdateDump = await askRefreshDump(localDumpDate);

  if (shouldUpdateDump) {
    console.log("Refreshing dump...");
    await refreshDump(env);
  }

  console.log("Cleaning database...");
  await cleanDatabase();

  console.log("Loading dump");
  await loadDump(env);

  console.log("Dump loaded 🎉");
};

run();
