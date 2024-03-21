{{ config(
    materialized='incremental',
    unique_key="collection_id||'-'||product_id",
    pre_hook='delete from {{this}}'
) }}

WITH variant_data AS (
	SELECT
		bpv."productId" AS product_id,
		min(epv.price) AS cheapest_variant_price,
		max(epv.price) AS most_expensive_variant_price
	FROM
		fivetran_shopify.product_variant epv
	LEFT JOIN {{ref('store_base_product_variant')}} bpv ON bpv.shopify_id = epv.id
GROUP BY
	bpv."productId"
),
collections_with_rules AS (
	SELECT
		c.id,
		c.handle,
		COALESCE(c.rules::json ->> 'AND',
			c.rules::json ->> 'OR') AS rules,
		CASE WHEN c.rules::json ->> 'AND' IS NOT NULL THEN
			'AND'
		ELSE
			'OR'
		END AS OPERATOR
	FROM
		public."Collection" c
	WHERE
		c.rules IS NOT NULL
),
expanded_collections AS (
	SELECT
		cr.id AS collection_id,
		cr.handle AS handle,
		cr.operator,
		JSON_ARRAY_LENGTH(cr.rules::json) AS number_of_rules,
		json_array_elements(cr.rules::json) ->> 'field' AS rule_field,
		json_array_elements(cr.rules::json) ->> 'operator' AS rule_operator,
		LOWER(TRIM(json_array_elements(cr.rules::json) ->> 'value')) AS rule_value
	FROM
		collections_with_rules AS cr
),
products AS (
	SELECT
		ep.id,
		LOWER(TRIM(ep.brand)) AS brand,
		LOWER(TRIM(ep.gender)) AS gender,
		LOWER(TRIM(ep.vendor)) AS vendor,
		LOWER(TRIM(ep.title)) AS title,
		LOWER(TRIM(ep.model)) AS model,
		LOWER(TRIM(ep."productType")) AS product_type,
		STRING_AGG(ept.value, ',') AS discounts,
		vd.cheapest_variant_price::float AS cheapest_variant_price,
		vd.most_expensive_variant_price::float AS most_expensive_variant_price
	FROM
		{{ref('store_exposed_product')}} ep
	LEFT JOIN variant_data vd ON ep.id = vd.product_id
	LEFT JOIN {{ref('store_exposed_product_tags')}} ept ON pt.tag = 'discount' AND pt.product_id = ep.id
	GROUP BY ep.id
)

SELECT
	ec.collection_id,
	p.id AS product_id,
	CURRENT_DATE AS "syncDate"
FROM
	expanded_collections ec
	JOIN products p ON (
			(ec.rule_field = 'brand'
				AND ec.rule_operator = 'equals'
				AND p.brand = ec.rule_value)
			OR(ec.rule_field = 'gender'
				AND ec.rule_operator = 'equals'
				AND p.gender = ec.rule_value)
			OR(ec.rule_field = 'product_type'
				AND ec.rule_operator = 'equals'
				AND p.product_type = ec.rule_value)
			OR(ec.rule_field = 'product_type'
				AND ec.rule_operator = 'contains'
				AND p.product_type LIKE '%' || ec.rule_value || '%')
			OR(ec.rule_field = 'product_type'
				AND ec.rule_operator = 'not_contains'
				AND p.product_type NOT LIKE '%' || ec.rule_value || '%')
			OR(ec.rule_field = 'vendor'
				AND ec.rule_operator = 'equals'
				AND p.vendor = ec.rule_value)
			OR(ec.rule_field = 'model'
				AND ec.rule_operator = 'equals'
				AND p.model = ec.rule_value)
			OR(ec.rule_field = 'title'
				AND ec.rule_operator = 'contains'
				AND p.title LIKE '%' || ec.rule_value || '%')
			OR(ec.rule_field = 'title'
				AND ec.rule_operator = 'not_contains'
				AND p.title NOT LIKE '%' || ec.rule_value || '%')
			OR(ec.rule_field = 'variant_price'
				AND ec.rule_operator = 'less_than'
				AND p.cheapest_variant_price < ec.rule_value::float)
			OR(ec.rule_field = 'variant_price'
				AND ec.rule_operator = 'more_than'
				AND p.most_expensive_variant_price > ec.rule_value::float)
			OR(ec.rule_field = 'id'
				AND ec.rule_operator = 'in'
				AND p.id = any(string_to_array(ec.rule_value, ',')))
			OR(ec.rule_field = 'discount_tag'
				ec.rule_operator = 'contains'
				AND p.discounts LIKE '%' || ec.rule_value || '%'
			)
		)
	GROUP BY
		ec.collection_id,
		ec.operator,
		ec.number_of_rules,
		p.id
	HAVING (ec.operator = 'AND'
		AND count(*) = ec.number_of_rules)
	OR ec.operator = 'OR'
