{{ config(materialized='table') }}


with dim_customer as (
    select
        c.id as customer_id,
				b_c.authUserId as internal_id,
        max(DATETIME(c.created_at, 'Europe/Paris')) as creation_datetime,
        max(date_trunc(DATETIME(c.created_at, 'Europe/Paris'), day)) as creation_date,
        max(ca.first_name) as first_name,
        max(ca.last_name) as last_name,
        max(ca.country) as country,
        c.email as email,
        max(ca.phone) as phone,
        max(CAST(b_c.ispro as STRING)) as is_pro,
        max(b_c.sellername) as username,
        -- Left this column in the refacto from fivetran to airbyte: maybe can be removed
        -- Reason: column b_c.type was removed from the Customer table
        null as type
    from shopify.customer c
    left join shopify.customer_address ca on ca.customer_id = c.id
    left join backend__public.Customer b_c ON b_c.shopifyid = c.id
    group by c.id, b_c.authUserId, c.email
)

select *
from dim_customer
order by 2 desc
