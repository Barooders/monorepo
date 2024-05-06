{{ config(
    materialized='incremental',
	unique_key='id',
	pre_hook='delete from {{this}}'
) }}

WITH dc AS (
  SELECT
    price_rule_id,
    MAX(code) AS code
  FROM fivetran_shopify.discount_code GROUP BY price_rule_id
)

SELECT
  pr.id,
  pr.title,
  pr.starts_at,
  pr.ends_at,
  pr.prerequisite_subtotal_range AS min_amount,
  dc.code,
  pr.value_type,
  -pr.value AS value, -- noqa: RF04, (ignore reserved keyword)
  COALESCE(customer_selection = 'all', FALSE) AS is_public -- noqa: RF02, (references should be qualified if select has more than one referenced table/view)
FROM fivetran_shopify.price_rule AS pr
LEFT JOIN
  dc
  ON pr.id = dc.price_rule_id
