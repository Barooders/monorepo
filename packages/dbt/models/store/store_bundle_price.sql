{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    bp.id,
    bp."minQuantity" as min_quantity,
    (1 + GET_GLOBAL_B2B_BUYER_COMMISSION() / 100) * bp."unitPriceInCents" as unit_price_in_cents,
    bp."productId" as product_id
FROM public."BundlePrice" bp