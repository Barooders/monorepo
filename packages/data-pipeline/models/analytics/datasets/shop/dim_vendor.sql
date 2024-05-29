{{ config(materialized='table') }}


with dim_vendor as (
    select distinct
        b_c.authUserId as internal_id,
        DATETIME(b_c.createdAt, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(b_c.createdAt, 'Europe/Paris'), day) as creation_date,
        null as state,
        CAST(b_c.ispro as STRING) as is_pro,
        b_c.sellerName as username,
        -- Left this column in the refacto from fivetran to airbyte: maybe can be removed
        -- Reason: column b_c.type was removed from the Customer table
        null as type,
        b_c.firstname,
        b_c.lastname,
        null as country,
        b_u.email as email,
        b_c.scoring,
        b_c.usedshipping
    from backend__public.Product b_p
    left join backend__public.Customer b_c ON b_c.authUserId = b_p.vendorId
    left join backend__auth.users b_u on b_u.id = b_c.authUserId
    group by 1,2,3,4,5,6,7,8,9,10,11,12,13
)

select *
from dim_vendor
order by 2 desc
