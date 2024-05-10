with ecommerce_orders as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'orders' as indicator_name,
        count(distinct o.order_id) as indicator_value
    from {{ref('fact_order_line')}} o 
    where vendor != 'Commission'
    group by date, owner, indicator_name

)

select *
from ecommerce_orders
