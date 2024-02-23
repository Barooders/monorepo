{{ config(
    materialized='incremental',
	unique_key='id',
	pre_hook='delete from {{this}}'
) }}

SELECT
		pr.id,
		pr.title,
		pr.starts_at,
		pr.ends_at,
		-pr.value AS value,
		pr.prerequisite_subtotal_range AS min_amount,
		dc.code,
		pr.value_type,
		CASE WHEN customer_selection = 'all' THEN true ELSE false END AS is_public
FROM fivetran_shopify.price_rule pr
	LEFT JOIN
		(SELECT MAX(code) AS code, price_rule_id FROM fivetran_shopify.discount_code GROUP BY price_rule_id) dc
		ON dc.price_rule_id = pr.id