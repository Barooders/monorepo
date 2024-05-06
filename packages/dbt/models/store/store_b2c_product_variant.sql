{{
    config(
        materialized="incremental",
        unique_key="id",
        pre_hook="delete from {{this}}",
    )
}}

SELECT
  bpv.id,
  ppv."priceInCents"::float / 100 AS price,
  ppv."compareAtPriceInCents"::float / 100 AS compare_at_price
FROM {{ ref("store_base_product_variant") }} AS bpv
LEFT JOIN public."ProductVariant" AS ppv ON bpv.id = ppv.id
LEFT JOIN
  public."ProductSalesChannel" AS psc
  ON bpv."productId" = psc."productId"
WHERE psc."salesChannelName"::text = 'PUBLIC'
