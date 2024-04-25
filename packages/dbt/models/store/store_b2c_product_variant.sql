{{
    config(
        materialized="incremental",
        unique_key="id",
        pre_hook="delete from {{this}}",
    )
}}

select
    bpv.id,
    ppv."priceInCents" / 100 as price,
    ppv."compareAtPriceInCents" / 100 AS compare_at_price
from {{ ref("store_base_product_variant") }} bpv
left join public."ProductVariant" ppv on ppv.id = bpv.id
left join public."ProductSalesChannel" psc on bpv."productId" = psc."productId"
where psc."salesChannelName"::text = 'PUBLIC'
