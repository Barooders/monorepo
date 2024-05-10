#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE SCHEMA IF NOT EXISTS medusa;
    CREATE SCHEMA IF NOT EXISTS strapi;
    ALTER DATABASE "$POSTGRES_DB" SET search_path TO "\$user", "public", "heroku_ext";
EOSQL
