{{
    config(
        materialized="incremental",
        unique_key="id",
        pre_hook="delete from {{this}}",
    )
}}

WITH
bikes AS (
  SELECT pc.product_id
  FROM {{ ref("store_product_collection") }} AS pc
  LEFT JOIN {{ ref("store_collection") }} AS c ON pc.collection_id = c.id
  WHERE c.handle = 'velos'
),

nested_product_options AS (
  SELECT
    id AS shopify_product_id,
    (jsonb_array_elements(options)) AS option -- noqa: RF04
  FROM airbyte_shopify.products
),

product_options AS (
  SELECT
    shopify_product_id,
    (option -> 'id')::bigint AS id,
    (option -> 'position')::int AS position, -- noqa: RF04
    option ->> 'name' AS name, -- noqa: RF04
    option -> 'values' AS values -- noqa: RF04
  FROM nested_product_options
)

SELECT
  bpv.id,
  ppv.quantity AS "inventory_quantity",
  po1.name AS "option1Name",
  pv.option1 AS "option1",
  po2.name AS "option2Name",
  pv.option2 AS "option2",
  po3.name AS "option3Name",
  pv.option3 AS "option3",
  pv.requires_shipping AS "requiresShipping",
  pv.title,
  pv.updated_at AS "updatedAt",
  ((ppv.condition)::text)::dbt."Condition" AS "condition",
  current_date AS "syncDate",
  coalesce(
    (ppv.condition)::text <> 'AS_NEW'
    AND c."isRefurbisher" = true
    AND pp.id IN (SELECT product_id FROM bikes), false
  ) AS "isRefurbished",
  ppv."priceInCents"::float / 100 AS price,
  ppv."compareAtPriceInCents"::float / 100 AS compare_at_price

FROM {{ ref("store_base_product_variant") }} AS bpv
LEFT JOIN public."ProductVariant" AS ppv ON bpv.id = ppv.id
LEFT JOIN public."Product" AS pp ON ppv."productId" = pp.id
LEFT JOIN public."Customer" AS c ON pp."vendorId" = c."authUserId"
LEFT JOIN airbyte_shopify.product_variants AS pv ON bpv."shopify_id" = pv.id

LEFT JOIN
  product_options AS po1
  ON (pv.product_id = po1.shopify_product_id AND po1.position = 1)
LEFT JOIN
  product_options AS po2
  ON (pv.product_id = po2.shopify_product_id AND po2.position = 2)
LEFT JOIN
  product_options AS po3
  ON (pv.product_id = po3.shopify_product_id AND po3.position = 3)

WHERE
  ppv.quantity IS NOT null
  AND ppv."priceInCents" IS NOT null
