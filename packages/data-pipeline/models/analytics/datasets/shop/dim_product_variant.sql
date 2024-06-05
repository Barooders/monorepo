{{ config(materialized='table') }}


with dim_product_variant as (
    select
        b_pv.id as internal_id,
        b_pv.shopify_id,
        b_pv.merchant_item_id,
        DATETIME(b_pv.createdAt, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(b_pv.createdAt, 'Europe/Paris'), day) as creation_date,
        b_pv.productId as product_internal_id,
        b_epv.option1 as option_1,
        b_epv.option2 as option_2,
        b_epv.option3 as option_3,
        b_epv.title,
        v.sku,
        v.weight as grams,
        b_pv.price as price,
        b_pv.compare_at_price,
        b_epv.inventory_quantity,
        b_epv.requiresShipping as requires_shipping,
    from backend__dbt.store_base_product_variant b_pv
    left join backend__dbt.store_exposed_product_variant b_epv on b_epv.id = b_pv.id
    left join medusa.product_variant v ON b_pv.medusa_id = v.id

select *
from dim_product_variant
order by 3 desc