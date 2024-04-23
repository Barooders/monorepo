{{
    config(
        materialized="incremental",
        unique_key="shopify_id",
        pre_hook="delete from {{this}}",
    )
}}

select
    epv.shopify_id,
    epv."inventoryQuantity" AS inventory_quantity,
    epv."syncDate" AS sync_date,
    (1 + get_global_b2b_buyer_commission() / 100) * ppv."priceInCents" / 100 as "price",
    epv."compareAtPrice" AS compare_at_price,
    epv.condition,
    epv.title,
    epv."updatedAt" AS updated_at
from {{ ref("store_exposed_product_variant") }} epv
join {{ ref("store_base_product_variant") }} bpv on bpv.shopify_id = epv.shopify_id
left join public."ProductVariant" ppv on ppv.id = bpv.id
left join public."ProductSalesChannel" psc on bpv."productId" = psc."productId"
where psc."salesChannelName"::text = 'B2B'
