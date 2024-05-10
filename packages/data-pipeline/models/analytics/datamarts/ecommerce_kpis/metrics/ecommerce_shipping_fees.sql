with ecommerce_shipping_fees as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'shipping_fees' as indicator_name,
        sum(o.shipping_amount) as indicator_value
    from {{ref('fact_order_line')}} o 
    group by date, owner, indicator_name
  
)

select *
from ecommerce_shipping_fees