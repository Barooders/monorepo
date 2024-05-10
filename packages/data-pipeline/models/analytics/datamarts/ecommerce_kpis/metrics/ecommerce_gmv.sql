with ecommerce_gmv as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'gmv' as indicator_name,
        sum(o.total_price) as indicator_value
    from {{ref('fact_order_line')}} o 
    group by date, owner, indicator_name

)

select *
from ecommerce_gmv