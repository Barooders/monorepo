{{
    config(
        materialized="incremental",
        unique_key="id",
        pre_hook="delete from {{this}}",
    )
}}

with
    bikes as (
        select pc.product_id
        from {{ ref("store_product_collection") }} pc
        left join {{ ref("store_collection") }} c on pc.collection_id = c.id
        where c.handle = 'velos'
    )

select
    bpv."shopify_id" as "shopify_id",
    bpv.id as id,
    ppv.quantity as "inventory_quantity",
    current_date as "syncDate",
    po1.name as "option1Name",
    pv.option_1 as "option1",
    po2.name as "option2Name",
    pv.option_2 as "option2",
    po3.name as "option3Name",
    pv.option_3 as "option3",
    pv.requires_shipping as "requiresShipping",
    pv.title,
    cast(ppv.condition::text as dbt."Condition") as "condition",
    case
        when
            ppv.condition::text <> 'AS_NEW'
            and c."isRefurbisher" = true
            and pp.id in (select product_id from bikes)
        then true
        else false
    end as "isRefurbished",
    pv.updated_at as "updatedAt"

from {{ ref("store_base_product_variant") }} bpv
left join public."ProductVariant" ppv on ppv.id = bpv.id
left join public."Product" pp on ppv."productId" = pp.id
left join public."Customer" c on pp."vendorId" = c."authUserId"
left join fivetran_shopify.product_variant pv on pv.id = bpv."shopify_id"

left join
    fivetran_shopify.product_option po1
    on (po1.product_id = pv.product_id and po1.position = 1)
left join
    fivetran_shopify.product_option po2
    on (po2.product_id = pv.product_id and po2.position = 2)
left join
    fivetran_shopify.product_option po3
    on (po3.product_id = pv.product_id and po3.position = 3)

where
    ppv.quantity is not null
    and ppv."priceInCents" is not null
