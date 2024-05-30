{{ config(materialized='table') }}


with dim_product_variant as (
    select 
        b_pv.id as internal_id,
        b_pv.shopifyId as shopify_id,
        b_pv.merchantItemId as merchant_item_id,
        DATETIME(b_pv.createdAt, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(b_pv.createdAt, 'Europe/Paris'), day) as creation_date,
        b_pv.productId as product_internal_id ,
        v.option_1 ,
        v.option_2 ,
        v.option_3 ,
        v.title ,
        v.sku ,
        v.grams ,
        b_pv.priceInCents / 100 as price,
        b_pv.compareAtPriceInCents / 100 as compare_at_price,
        b_pv.quantity,
        v.requires_shipping as requires_shipping,
    from backend__public.ProductVariant b_pv
    left join shopify.product_variant v ON b_pv.shopifyId = v.id)

select *
from dim_product_variant
order by 3 desc