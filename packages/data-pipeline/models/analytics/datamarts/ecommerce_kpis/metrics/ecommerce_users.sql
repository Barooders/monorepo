with ecommerce_users as (
    
    select 
        t.`date` , 
        cast(null as string) as owner,
        'users' as indicator_name,
        sum(t.users) as indicator_value

    from {{ref('fact_traffic')}} t
    where utm_campaign = 'all' and utm_medium = 'all' and utm_source = 'all'
    group by date, owner, indicator_name

)

select *
from ecommerce_users