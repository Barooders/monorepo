{{ config(materialized='table') }}


with dim_customer as (
    select
		b_c.authUserId as internal_id,
        max(DATETIME(TIMESTAMP(b_c.createdAt), 'Europe/Paris')) as creation_datetime,
        max(date_trunc(DATETIME(TIMESTAMP(b_c.createdAt), 'Europe/Paris'), day)) as creation_date,
        max(b_c.firstName) as first_name,
        max(b_c.lastName) as last_name,
        null as country,
        b_u.email as email,
        max(b_u.phone_number) as phone,
        max(CAST(b_c.ispro as STRING)) as is_pro,
        max(b_c.sellername) as username,
        -- Left this column in the refacto from fivetran to airbyte: maybe can be removed
        -- Reason: column b_c.type was removed from the Customer table
        null as type
    from backend__public.Customer b_c
    left join backend__auth.users b_u on b_u.id = b_c.authUserId
    group by b_c.authUserId, b_u.email
)

select *
from dim_customer
order by 2 desc
