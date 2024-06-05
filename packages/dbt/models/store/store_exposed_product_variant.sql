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

product_options AS (
  SELECT
    SELECT po.*,
    ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY created_at DESC) AS position
  FROM medusa.product_option AS po
)

SELECT
  bpv.id,
  ppv.quantity AS "inventory_quantity",
  po1.name AS "option1Name",
  pov1.value AS "option1",
  po2.name AS "option2Name",
  pov2.value AS "option2",
  po3.name AS "option3Name",
  pov3.value AS "option3",
  pv.requires_shipping AS "requiresShipping",
  pv.title,
  pv.updated_at AS "updatedAt",
  ((ppv.condition)::text)::dbt."Condition" AS "condition",
  CURRENT_DATE AS "syncDate",
  COALESCE(
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
LEFT JOIN medusa.product_variant AS pv ON bpv."medusa_id" = pv.id

LEFT JOIN
  product_options AS po1
  ON (pv.id = po1.product_id AND po1.position = 1)
LEFT JOIN
  medusa.product_option_value AS pov1
  ON (po1.id = pov1.option_id AND pv.id = pov1.variant_id)
LEFT JOIN
  product_options AS po2
  ON (pv.id = po2.product_id AND po2.position = 2)
LEFT JOIN
  medusa.product_option_value AS pov2
  ON (po2.id = pov2.option_id AND pv.id = pov2.variant_id)
LEFT JOIN
  product_options AS po3
  ON (pv.id = po3.product_id AND po3.position = 3)
LEFT JOIN
  medusa.product_option_value AS pov3
  ON (po3.id = pov3.option_id AND pv.id = pov3.variant_id)

WHERE
  ppv.quantity IS NOT null
  AND ppv."priceInCents" IS NOT null
