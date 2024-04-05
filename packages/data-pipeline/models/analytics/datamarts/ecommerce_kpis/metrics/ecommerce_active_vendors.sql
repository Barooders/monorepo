with ecommerce_active_vendors as (
    
    select 
        date_trunc(p.creation_date, day) as date, 
        p.owner as owner,
        'active_vendors' as indicator_name,
        count(distinct p.vendor_id) as indicator_value
    from {{ref('dim_product')}} p 
    group by date, owner, indicator_name

)

select *
from ecommerce_active_vendors