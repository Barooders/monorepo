with ecommerce_submitted_products as (
    
    select 
        date_trunc(p.creation_date, day) as date, 
        p.owner as owner,
        'submitted_products' as indicator_name,
        count(distinct p.id) as indicator_value
    from {{ref('dim_product')}} p
    group by date, owner, indicator_name

)

select *
from ecommerce_submitted_products