{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    bp.id AS id,
    bp.published_at,
    bp.product_type,
    bp.status,
    bp.total_quantity,
    bp.largest_bundle_price_in_cents,
    bp.title,
    bp.brand,
    bp.handle,
    bp.sync_date,
    bp.first_image

FROM {{ref('store_base_product')}} bp
LEFT JOIN public."ProductSalesChannel" psc ON bp.id = psc."productId"

WHERE
  bp.product_type IS NOT NULL
  AND bp.title IS NOT NULL
  AND psc."salesChannelName"::TEXT='B2B'
