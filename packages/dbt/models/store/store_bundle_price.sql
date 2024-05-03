{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
  bp.id,
  bp."minQuantity" AS min_quantity,
  bp."productId" AS product_id,
  (1 + GET_GLOBAL_B2B_BUYER_COMMISSION() / 100)
  * bp."unitPriceInCents" AS unit_price_in_cents
FROM public."BundlePrice" AS bp
