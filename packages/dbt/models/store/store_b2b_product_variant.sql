{{ config(
    materialized='incremental',
    unique_key='shopify_id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    bpv."shopify_id" AS "shopify_id",
    pv.inventory_quantity AS "inventory_quantity",
    CURRENT_DATE AS "sync_date",
    pv.price,
    CAST(ppv.condition::TEXT AS dbt."Condition") as "condition",
    pv.updated_at AS "updated_at"

FROM {{ref('store_base_product_variant')}} bpv
LEFT JOIN public."ProductVariant" ppv ON ppv.id = bpv.id
LEFT JOIN fivetran_shopify.product_variant pv ON pv.id = bpv."shopify_id"

WHERE
  pv.inventory_quantity IS NOT NULL
  AND pv.price IS NOT NULL
  AND pv.updated_at IS NOT NULL