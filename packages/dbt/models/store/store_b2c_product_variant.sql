{{
    config(
        materialized="incremental",
        unique_key="shopify_id",
        pre_hook="delete from {{this}}",
    )
}}

select epv.shopify_id, ppv."priceInCents"::float / 100 as "price"
from {{ ref("store_exposed_product_variant") }} epv
join {{ ref("store_base_product_variant") }} bpv on bpv.shopify_id = epv.shopify_id
left join public."ProductVariant" ppv on ppv.id = bpv.id
left join public."ProductSalesChannel" psc on bpv."productId" = psc."productId"
where psc."salesChannelName"::text = 'PUBLIC'
