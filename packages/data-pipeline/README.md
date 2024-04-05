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
- Learn more about dbt [in the docs](https://docs.getdbt.com/docs/introduction)
- Check out [Discourse](https://discourse.getdbt.com/) for commonly asked questions and answers
- Join the [chat](https://community.getdbt.com/) on Slack for live discussions and support
- Find [dbt events](https://events.getdbt.com) near you
- Check out [the blog](https://blog.getdbt.com/) for the latest news on dbt's development and best practices

### Code standards
- dim_product is used in multiple other tables, and hence should be considered as a root model