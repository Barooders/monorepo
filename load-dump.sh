#!/bin/bash

# You can download dumps at this location: https://dashboard.render.com/d/dpg-co3cfo821fec738v4qlg-a/recovery

DUMP_DIRECTORY=dumps/db-staging-backup.sql
DB_INTERNAL_URL=postgres://postgres:password@localhost:5432/barooders-backend

if [ ! -f $DUMP_DIRECTORY ]; then
	echo "You should have your dump located at $DUMP_DIRECTORY"
fi

echo "Loading data from $DUMP_DIRECTORY"
docker-compose exec barooders-DB psql $DB_INTERNAL_URL -f /usr/local/$DUMP_DIRECTORY > /dev/null

echo "Finished loading data, running migrations"
yarn workspace backend prisma:migrate
