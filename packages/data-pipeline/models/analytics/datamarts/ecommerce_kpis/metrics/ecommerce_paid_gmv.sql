with ecommerce_paid_gmv as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'paid_gmv' as indicator_name,
        sum(o.total_price) as indicator_value
    from {{ref('fact_order_line')}} o 
    where o.financial_status != 'pending'
    group by date, owner, indicator_name

)

select *
from ecommerce_paid_gmv
