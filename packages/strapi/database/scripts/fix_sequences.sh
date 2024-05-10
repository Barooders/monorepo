#!/bin/bash

SCRIPT_DIR=./database/scripts
BUILD_DIR=$SCRIPT_DIR/build
DATABASE_URL=$1

function runPsql() {
	psql $DATABASE_URL "${@}"
}

rm $BUILD_DIR/*

echo "Fixing sequence ownserhip"

runPsql -Atq -f $SCRIPT_DIR/create_fix_sequences_ownership.sql >> $BUILD_DIR/fix_sequences_ownership.sql
runPsql -f $BUILD_DIR/fix_sequences_ownership.sql

echo "Updating sequence values"

runPsql -Atq -f $SCRIPT_DIR/create_update_sequence_val.sql >> $BUILD_DIR/update_sequence_val.sql
runPsql -f $BUILD_DIR/update_sequence_val.sql
