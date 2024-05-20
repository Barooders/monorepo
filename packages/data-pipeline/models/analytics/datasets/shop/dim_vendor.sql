{{ config(materialized='table') }}


with dim_vendor as (
    select distinct
        b_c.shopifyid as id,
        DATETIME(c.created_at, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(c.created_at, 'Europe/Paris'), day) as creation_date,
        c.state,
        CAST(b_c.ispro as STRING) as is_pro,
        b_c.sellername as username,
        -- Left this column in the refacto from fivetran to airbyte: maybe can be removed
        -- Reason: column b_c.type was removed from the Customer table
        null as type,
        b_c.firstname,
        b_c.lastname,
        ca.country as country,
        c.email as email,
        b_c.scoring,
        b_c.usedshipping
    from shopify.product p
    left join backend__dbt.store_product_for_analytics b_p on b_p.shopify_id = p.id
    left join backend__public.Customer b_c ON b_c.authuserid = b_p.vendor_id
    left join shopify.customer c on c.id = b_c.shopifyid
    left join shopify.customer_address ca on ca.customer_id = c.id
    group by 1,2,3,4,5,6,7,8,9,10,11,12,13
)

select *
from dim_vendor
order by 2 desc
