with ecommerce_unioned_kpis as (

    select * from {{ref('ecommerce_gmv')}}  
    union all 
    select * from {{ref('ecommerce_buyer_commission')}}  
    union all
    select * from {{ref('ecommerce_paid_gmv')}}  
    union all 
    select * from {{ref('ecommerce_paid_buyer_commission')}}  
    union all
    select * from {{ref('ecommerce_buyers')}}
    union all 
    select * from {{ref('ecommerce_orders')}}
    union all 
    select * from {{ref('ecommerce_paid_orders')}}
    union all 
    select * from {{ref('ecommerce_sessions')}}
    union all 
    select * from {{ref('ecommerce_users')}}
    union all 
    select * from {{ref('ecommerce_new_buyers')}}
    union all 
    select * from {{ref('ecommerce_shipping_fees')}}
    union all 
    select * from {{ref('ecommerce_subscribers')}}
    union all 
    select * from {{ref('ecommerce_submitted_products')}}
    union all 
    select * from {{ref('ecommerce_active_vendors')}}
    union all 
    select * from {{ref('ecommerce_new_vendors')}}
    union all 
    select * from {{ref('ecommerce_returners')}}
    union all 
    select * from {{ref('ecommerce_refunds')}}
    union all 
    select * from {{ref('ecommerce_discounts')}}
    union all 
    select * from {{ref('ecommerce_gross_sales')}}
    union all 
    select * from {{ref('ecommerce_gross_sales_paid')}}
    union all 
    select * from {{ref('ecommerce_shipping_fees_paid')}}
    union all 
    select * from {{ref('ecommerce_bike_gmv')}}

)

select *
from ecommerce_unioned_kpis
