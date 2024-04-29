-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "heroku_ext";

-- AlterExtension
ALTER EXTENSION "citext" SET SCHEMA "heroku_ext";

-- AlterExtension
ALTER EXTENSION "pgcrypto" SET SCHEMA "heroku_ext";
