with ecommerce_bike_gmv as (
    
    select 
        date_trunc(o.creation_date, day) as date,
        o.owner as owner,
        'bike_gmv' as indicator_name,
        sum(o.total_price) as indicator_value
    from {{ref('fact_order_line')}} o 
    join {{ref('dim_product')}} p on p.shopify_id = o.product_id
    where p.product_type in (
        'VTT',
        'Vélos de course',
        'Vélos de triathlon',
        'Gravel',
        'BMX',
        'VTT électriques',
        'Vélos de route',
        'Vélos de route électriques',
        'Vélos de contre la montre',
        'Cyclocross',
        'Gravel électriques',
        'Vélos de trekking',
        'VTC électriques',
        'Vélos de ville électriques',
        'Vélos enfant',
        'Vélos de ville',
        'VTC',
        'Vélos vintage',
        'Vélos urbains et hollandais',
        'Vélos pliants',
        'Vélos longtail',
        'Vélos cargo',
        'Fixie et singlespeed'
    )
    group by date, o.owner, indicator_name

)

select *
from ecommerce_bike_gmv