#!/bin/bash

echo "VERCEL_AUTO_DEPLOY: $VERCEL_AUTO_DEPLOY"

# Check if there are changes in the specified directory
if git diff HEAD^ HEAD --quiet ./; then
  echo "🛑 - No changes detected in the directory."
  exit 0;
fi

# Check if environment is production or staging
if [[ "$VERCEL_AUTO_DEPLOY" == "true" ]] ; then
  # Proceed with the build
  echo "✅ - Build can proceed"
  exit 1;

else
  # Don't build
  echo "🛑 - Build cancelled"
  exit 0;
fi




git diff HEAD^ HEAD --quiet ./