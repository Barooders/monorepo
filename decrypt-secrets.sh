#!/bin/bash

source .env &> /dev/null || true

if [ -z $TRANSCRYPT_PASSWORD ]
then
	echo 'You should export a $TRANSCRYPT_PASSWORD. If you do not have it, ask someone to run ./bin/transcrypt -d'
	exit 1
fi
echo "Diff files:"
git diff --name-only | grep ''
echo " "
echo "Decrypting secrets..."
../../bin/transcrypt -y -c aes-256-cbc -p $TRANSCRYPT_PASSWORD || true
