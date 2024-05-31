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

### Connect to Airbyte Interface

Go to http://airbyte.barooders.com/ and connect with credentials in Bitwarden

### Connect to VM hoisting Airbyte

**Prerequisites**

1. Install Google Cloud CLI

   ```bash
   brew install --cask google-cloud-sdk
   ```

2. Login to Google Cloud
   ```bash
   gcloud init
   ```
   **Connect to the VM**

```bash
gcloud --project=$PROJECT_ID beta compute ssh $INSTANCE_NAME
```

### Relaunch Airbyte

If you stopped the VM, you must launch a script in order to fully relaunch Airbyte:

1. Connect to the VM as seen in the "Connect to VM hoisting Airbyte" section
2. Run the following script

   ```bash
   cd airbyte
   ./run-ab-platform.sh -b
   ```

### Troubleshooting

1. The instance freeze during a synchro

It seems it can happen if the amount of new data is large. You can go on the GCP interface to stop and resume the instance, which you fix the issue.
Then, try to sync smaller chunks of data (by adding fewer table at a time to the synchro)

If you restart the VM, relaunch the Airbyte script in the as seen in the "Relaunch Airbyte" section

2. Could not find image when checking source

If you face the following issue

```bash
2024-05-31 04:25:24 platform > Checking if airbyte/source-postgres:3.4.1 exists...
2024-05-31 04:25:45 platform > airbyte/source-postgres:3.4.1 not found locally. Attempting to pull the image...
2024-05-31 04:26:16 platform > Image does not exist.
2024-05-31 04:26:16 platform > Unexpected error while checking connection:
io.airbyte.workers.exception.WorkerException: Could not find image: airbyte/source-postgres:3.4.1
```

Relaunch the Airbyte startup script as seen in the "Relaunch Airbyte" section

See: https://www.loom.com/share/10cbae6cef6744008364bb2c06ae82b7?sid=57e7591b-3a35-49af-949a-7b0a79f3f2de

3. Implementation of CDC

Not possible with Heroku databases. See https://github.com/heroku/roadmap/issues/38
