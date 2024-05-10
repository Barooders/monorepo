with ecommerce_discounts as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'discounts' as indicator_name,
        sum(o.total_discounts) as indicator_value
    from {{ref('fact_order_line')}} o 
    group by date, owner, indicator_name

)

select *
from ecommerce_discounts