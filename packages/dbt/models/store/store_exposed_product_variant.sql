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
)

SELECT
  bpv.id,
  ppv.quantity AS "inventory_quantity",
  po1.name AS "option1Name",
  pv.option_1 AS "option1",
  po2.name AS "option2Name",
  pv.option_2 AS "option2",
  po3.name AS "option3Name",
  pv.option_3 AS "option3",
  pv.requires_shipping AS "requiresShipping",
  pv.title,
  cast(cast(ppv.condition AS text) AS dbt."Condition") AS "condition",
  pv.updated_at AS "updatedAt",
  current_date AS "syncDate",
  coalesce(
    cast(ppv.condition AS text) <> 'AS_NEW'
    AND c."isRefurbisher" = true
    AND pp.id IN (SELECT product_id FROM bikes), false
  ) AS "isRefurbished"

FROM {{ ref("store_base_product_variant") }} AS bpv
LEFT JOIN public."ProductVariant" AS ppv ON bpv.id = ppv.id
LEFT JOIN public."Product" AS pp ON ppv."productId" = pp.id
LEFT JOIN public."Customer" AS c ON pp."vendorId" = c."authUserId"
LEFT JOIN fivetran_shopify.product_variant AS pv ON bpv."shopify_id" = pv.id

LEFT JOIN
  fivetran_shopify.product_option AS po1
  ON (pv.product_id = po1.product_id AND po1.position = 1)
LEFT JOIN
  fivetran_shopify.product_option AS po2
  ON (pv.product_id = po2.product_id AND po2.position = 2)
LEFT JOIN
  fivetran_shopify.product_option AS po3
  ON (pv.product_id = po3.product_id AND po3.position = 3)

WHERE
  ppv.quantity IS NOT null
  AND ppv."priceInCents" IS NOT null
