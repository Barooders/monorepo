with ecommerce_sessions as (
    
    select 
        t.`date` , 
        cast(null as string) as owner,
        'sessions' as indicator_name,
        sum(t.sessions) as indicator_value
    from {{ref('fact_traffic')}} t 
    where t.utm_source = 'all'
    group by date, owner, indicator_name

)

select *
from ecommerce_sessions