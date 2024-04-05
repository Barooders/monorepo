with ecommerce_new_buyers as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'new_buyers' as indicator_name,
        count(distinct o.customer_id) as indicator_value
    from {{ref('fact_order_line')}} o 
    left join {{ref('fact_order_line')}} o_before on o_before.customer_id = o.customer_id and o_before.creation_date < o.creation_date 
    where o_before.id is null
    group by date, owner, indicator_name

)

select *
from ecommerce_new_buyers