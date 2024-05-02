{{
    config(
        materialized="incremental",
        unique_key="id",
        pre_hook="delete from {{this}}",
    )
}}

select
    bpv.id,
    (1 + get_global_b2b_buyer_commission() / 100) * ppv."priceInCents"::float / 100 as price,
    ppv."compareAtPriceInCents"::float / 100 AS compare_at_price
from {{ ref("store_base_product_variant") }} bpv
left join public."ProductVariant" ppv on ppv.id = bpv.id
left join public."ProductSalesChannel" psc on bpv."productId" = psc."productId"
where psc."salesChannelName"::text = 'B2B'
