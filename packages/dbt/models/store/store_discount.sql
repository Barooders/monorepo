{{ config(
    materialized='incremental',
	unique_key='id',
	pre_hook='delete from {{this}}'
) }}

WITH dc AS (
  SELECT
    price_rule_id,
    MAX(code) AS code
  FROM airbyte_shopify.discount_codes GROUP BY price_rule_id
)

SELECT
  pr.id,
  pr.title,
  pr.starts_at,
  pr.ends_at,
  (pr.prerequisite_subtotal_range ->> 'greater_than_or_equal_to')::double precision AS min_amount,
  dc.code,
  pr.value_type,
  -(pr.value::double precision) AS value, -- noqa: RF04, (ignore reserved keyword)
  COALESCE(customer_selection = 'all', FALSE) AS is_public -- noqa: RF02, (references should be qualified if select has more than one referenced table/view)
FROM airbyte_shopify.price_rules AS pr
LEFT JOIN
  dc
  ON pr.id = dc.price_rule_id
WHERE pr.deleted_at IS NULL
