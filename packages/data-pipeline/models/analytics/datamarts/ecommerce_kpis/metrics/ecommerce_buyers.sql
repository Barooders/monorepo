with ecommerce_buyers as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'buyers' as indicator_name,
        count(distinct o.customer_id) as indicator_value
    from {{ref('fact_order_line')}} o 
    group by date, owner, indicator_name

)

select *
from ecommerce_buyers

