with ecommerce_new_vendors as (
    
    select 
        date_trunc(p.creation_date, day) as date, 
        p.owner as owner,
        'new_vendors' as indicator_name,
        count(distinct p.vendor_id) as indicator_value
    from {{ref('dim_product')}} p
    left join {{ref('dim_product')}} p_before on p_before.vendor_id = p.vendor_id and p_before.creation_date < p.creation_date and p_before.status != 'draft'
    where p_before.id is null
    and p.status != 'draft'
    group by date, owner, indicator_name

)

select *
from ecommerce_new_vendors