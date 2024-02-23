if ! command -v gh &> /dev/null
then
    echo "You should install github CLI to use this script: https://cli.github.com"
    exit
fi

read -p 'PR title: ' TITLE

gh pr create -t "[STAGING] $TITLE" -b "" -B staging
gh pr create -t "[MAIN] $TITLE" -b "" -B main

echo ""
echo "☝️  Send the latest link (main) for review  ☝️"
echo ""
