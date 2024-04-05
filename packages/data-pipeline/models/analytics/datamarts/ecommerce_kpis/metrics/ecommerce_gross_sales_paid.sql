with ecommerce_gross_sales_paid as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'gross_sales_paid' as indicator_name,
        sum(o.product_price * o.quantity) as indicator_value
    from {{ref('fact_order_line')}} o 
    where o.financial_status != 'pending'
    group by date, owner, indicator_name

)

select *
from ecommerce_gross_sales_paid