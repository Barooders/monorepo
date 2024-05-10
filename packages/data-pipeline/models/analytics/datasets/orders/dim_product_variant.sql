{{ config(materialized='table') }}


with dim_product_variant as (
    select 
        v.id ,
        DATETIME(v.created_at, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(v.created_at, 'Europe/Paris'), day) as creation_date,
        v.product_id ,
        v.option_1 ,
        v.option_2 ,
        v.option_3 ,
        v.title ,
        v.sku ,
        v.grams ,
        v.price,
        v.compare_at_price,
        v.inventory_quantity,
        v.requires_shipping as requires_shipping,
    from shopify.product_variant v)

select *
from dim_product_variant
order by 2 desc