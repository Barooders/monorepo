with ecommerce_subscribers as (
    
    select 
        date_trunc(creation_date, day) as date, 
        cast(null as string) as owner,
        'subscribers' as indicator_name,
        sum(subscribers) as indicator_value
    from (
        select c.creation_date , count(distinct c.internal_id) subscribers
        from {{ref('dim_customer')}} c
        group by 1
        union all 
        select v.creation_date , count(distinct v.internal_id) subscribers
        from {{ref('dim_vendor')}} v
        group by 1)
    group by date, owner, indicator_name

)

select *
from ecommerce_subscribers