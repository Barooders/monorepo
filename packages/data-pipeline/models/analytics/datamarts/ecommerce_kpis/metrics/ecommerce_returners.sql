with ecommerce_returners as (
    
    select 
        date_trunc(o.creation_date, day) as date, 
        o.owner as owner,
        'returners' as indicator_name,
        count(distinct o.customer_id) as indicator_value
    from {{ref('fact_order_line')}} o 
    left join {{ref('fact_order_line')}} o_before on o_before.customer_id = o.customer_id and date_trunc(o_before.creation_date, day) < date_trunc(o.creation_date, day)  
    where o_before.id is not null
    group by date, owner, indicator_name

)

select *
from ecommerce_returners