Welcome to your new dbt project!

### Run locally

Prerequisites:

- Python is installed with pip. Check with `python -m pip install --upgrade pip`
- Install dbt with `pip install dbt-bigquery`
- Make sure you asked a developper for the keys (located in `config/local/keys`)
- Run `dbt compile --profiles-dir=config/local`

Then, test your code in staging, using commands like:

- `dbt run  --profiles-dir=config/local --models store_order` to run a specific file
- `dbt run  --profiles-dir=config/local --models +store` to run a specific folder

### Resources:

- Learn more about dbt [in the docs](https://docs.getdbt.com/docs/introduction).
- Check out [Discourse](https://discourse.getdbt.com/) for commonly asked questions and answers
- Join the [chat](https://community.getdbt.com/) on Slack for live discussions and support
- Find [dbt events](https://events.getdbt.com) near you
- Check out [the blog](https://blog.getdbt.com/) for the latest news on dbt's development and best practices

## Code standards

- dim_product is used in multiple other tables, and hence should be considered as a root model

## Connect to Airbyte

### Prerequisites

1. Install Google Cloud CLI

   ```bash
   brew install --cask google-cloud-sdk
   ```

2. Login to Google Cloud
   ```bash
   gcloud init
   ```

### Connect to Airbyte Interface

1. Create an SSH tunnel

   ```bash
   PROJECT_ID=direct-tribute-354315
   INSTANCE_NAME=airbyte-prod
   gcloud --project=$PROJECT_ID beta compute ssh $INSTANCE_NAME -- -L 18001:localhost:8000 -N -f
   ```

2. Go to http://localhost:18001 and connect with credentials in Bitwarden

### Connect to VM hoisting Airbyte

```bash
gcloud --project=$PROJECT_ID beta compute ssh $INSTANCE_NAME
```

### Troubleshooting

1. The instance freeze during a synchro

It seems it can happen if the amount of new data is large. You can go on the GCP interface to stop and resume the instance, which you fix the issue.
Then, try to sync smaller chunks of data (by adding fewer table at a time to the synchro)
