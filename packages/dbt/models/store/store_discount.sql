{{ config(
    materialized='incremental',
	unique_key='id',
	pre_hook='delete from {{this}}'
) }}

SELECT
  d.id,
  '' AS title,
  d.starts_at,
  d.ends_at,
  NULL AS min_amount,
  d.code,
  CASE
    WHEN dr.type = 'fixed' THEN 'fixed_amount'
    ELSE dr.type::text
  END AS value_type,
  dr.value::float / 100 AS value, -- noqa: RF04, (ignore reserved keyword)
  COALESCE(dcg.customer_group_id IS NULL, FALSE) AS is_public -- noqa: RF02, (references should be qualified if select has more than one referenced table/view)
FROM medusa.discount AS d
LEFT JOIN medusa.discount_rule AS dr ON d.rule_id = dr.id
LEFT JOIN medusa.discount_condition AS dc ON dr.id = dc.discount_rule_id
LEFT JOIN medusa.discount_condition_customer_group AS dcg ON dc.id = dcg.condition_id
WHERE d.deleted_at IS NULL
