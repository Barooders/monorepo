with ecommerce_refunds as (
    
    select 
        date_trunc(r.creation_date, day) as date, 
        r.owner as owner,
        'refunds' as indicator_name,
        sum(r.order_total_amount) as indicator_value
    from {{ref('fact_order_line_refund')}} r
    group by date, owner, indicator_name

)

select *
from ecommerce_refunds