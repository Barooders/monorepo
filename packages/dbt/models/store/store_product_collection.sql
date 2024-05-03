{{ config(
    materialized='incremental',
    unique_key="collection_id||'-'||product_id",
    pre_hook='delete from {{this}}'
) }}

WITH variant_data AS (
  SELECT
    ppv."productId" AS product_id,
    min(ppv."priceInCents"::float / 100) AS cheapest_variant_price,
    max(ppv."priceInCents"::float / 100) AS most_expensive_variant_price
  FROM
    public."ProductVariant" AS ppv
  GROUP BY ppv."productId"
),

collections_with_rules AS (
  SELECT
    c.id,
    c.handle,
    coalesce(
      c.rules::json ->> 'AND',
      c.rules::json ->> 'OR'
    ) AS rules,
    CASE
      WHEN c.rules::json ->> 'AND' IS NOT NULL
        THEN
          'AND'
      ELSE
        'OR'
    END AS operator -- noqa: RF04
  FROM
    public."Collection" AS c
  WHERE
    c.rules IS NOT NULL
),

expanded_collections AS (
  SELECT
    cr.id AS collection_id,
    cr.handle,
    cr.operator,
    json_array_length(cr.rules::json) AS number_of_rules,
    json_array_elements(cr.rules::json) ->> 'field' AS rule_field,
    json_array_elements(cr.rules::json) ->> 'operator' AS rule_operator,
    lower(trim(json_array_elements(cr.rules::json) ->> 'value')) AS rule_value
  FROM
    collections_with_rules AS cr
),

products AS (
  SELECT
    ep.id,
    min(vd.cheapest_variant_price)::float AS cheapest_variant_price,
    max(vd.most_expensive_variant_price)::float AS most_expensive_variant_price,
    lower(trim(ep.brand)) AS brand,
    lower(trim(ep.gender)) AS gender,
    lower(trim(ep.vendor)) AS vendor,
    lower(trim(ep.title)) AS title,
    lower(trim(ep.model)) AS model, -- noqa: RF04
    lower(trim(ep."productType")) AS product_type,
    string_agg(lower(trim(ept.value)), ',') AS discounts
  FROM
    {{ ref('store_exposed_product') }} AS ep
  LEFT JOIN variant_data AS vd ON ep.id = vd.product_id
  LEFT JOIN
    {{ ref('store_exposed_product_tag') }} AS ept
    ON ept.tag = 'discount' AND ep.id = ept.product_id
  GROUP BY ep.id
)

SELECT
  ec.collection_id,
  p.id AS product_id,
  current_date AS "syncDate"
FROM
  expanded_collections AS ec
INNER JOIN products AS p
  ON (
    (
      ec.rule_field = 'brand'
      AND ec.rule_operator = 'equals'
      AND ec.rule_value = p.brand
    )
    OR (
      ec.rule_field = 'gender'
      AND ec.rule_operator = 'equals'
      AND ec.rule_value = p.gender
    )
    OR (
      ec.rule_field = 'product_type'
      AND ec.rule_operator = 'equals'
      AND ec.rule_value = p.product_type
    )
    OR (
      ec.rule_field = 'product_type'
      AND ec.rule_operator = 'contains'
      AND p.product_type LIKE '%' || ec.rule_value || '%'
    )
    OR (
      ec.rule_field = 'product_type'
      AND ec.rule_operator = 'not_contains'
      AND p.product_type NOT LIKE '%' || ec.rule_value || '%'
    )
    OR (
      ec.rule_field = 'vendor'
      AND ec.rule_operator = 'equals'
      AND ec.rule_value = p.vendor
    )
    OR (
      ec.rule_field = 'model'
      AND ec.rule_operator = 'equals'
      AND ec.rule_value = p.model
    )
    OR (
      ec.rule_field = 'title'
      AND ec.rule_operator = 'contains'
      AND p.title LIKE '%' || ec.rule_value || '%'
    )
    OR (
      ec.rule_field = 'title'
      AND ec.rule_operator = 'not_contains'
      AND p.title NOT LIKE '%' || ec.rule_value || '%'
    )
    OR (
      ec.rule_field = 'variant_price'
      AND ec.rule_operator = 'less_than'
      AND p.cheapest_variant_price < ec.rule_value::float
    )
    OR (
      ec.rule_field = 'variant_price'
      AND ec.rule_operator = 'more_than'
      AND p.most_expensive_variant_price > ec.rule_value::float
    )
    OR (
      ec.rule_field = 'id'
      AND ec.rule_operator = 'in'
      AND p.id = any(string_to_array(ec.rule_value, ','))
    )
    OR (
      ec.rule_field = 'discount_tag'
      AND ec.rule_operator = 'contains'
      AND p.discounts LIKE '%' || ec.rule_value || '%'
    )
  )
GROUP BY
  ec.collection_id,
  ec.operator,
  ec.number_of_rules,
  p.id
HAVING (
  ec.operator = 'AND'
  AND count(*) = ec.number_of_rules
)
OR ec.operator = 'OR'
