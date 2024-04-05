with ecommerce_paid_buyer_commission as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'paid_buyer_commission' as indicator_name,
        sum(o.total_price) as indicator_value
    from {{ref('fact_order_line')}} o 
    where o.vendor = 'Commission' and o.financial_status != 'pending'
    group by date, owner, indicator_name

)

select *
from ecommerce_paid_buyer_commission