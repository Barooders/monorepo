{{ config(materialized='table') }}

with ecommerce_kpis as (

    select 
        date,
        owner, 
        sum(case when indicator_name = 'gmv' then indicator_value end) as gmv,
        sum(case when indicator_name = 'buyer_commission' then indicator_value end) as buyer_commission,
        sum(case when indicator_name = 'paid_gmv' then indicator_value end) as paid_gmv,
        sum(case when indicator_name = 'paid_buyer_commission' then indicator_value end) as paid_buyer_commission,
        coalesce(sum(case when indicator_name = 'gross_sales' then indicator_value end) , 0)
        - coalesce(sum(case when indicator_name = 'discounts' then indicator_value end) , 0)
        - coalesce(sum(case when indicator_name = 'refunds' then indicator_value end) , 0)
        + coalesce(sum(case when indicator_name = 'shipping_fees' then indicator_value end), 0) as net_gmv,
        coalesce(sum(case when indicator_name = 'gross_sales_paid' then indicator_value end) , 0)
        - coalesce(sum(case when indicator_name = 'discounts' then indicator_value end) , 0)
        - coalesce(sum(case when indicator_name = 'refunds' then indicator_value end) , 0)
        + coalesce(sum(case when indicator_name = 'shipping_fees_paid' then indicator_value end), 0) as net_gmv_paid,
        sum(case when indicator_name = 'buyers' then indicator_value end) as buyers,
        sum(case when indicator_name = 'orders' then indicator_value end) as orders,
        sum(case when indicator_name = 'paid_orders' then indicator_value end) as paid_orders,
        sum(case when indicator_name = 'sessions' then indicator_value end) as sessions,
        sum(case when indicator_name = 'users' then indicator_value end) as users,
        sum(case when indicator_name = 'new_buyers' then indicator_value end) as new_buyers,
        sum(case when indicator_name = 'shipping_fees' then indicator_value end) as shipping_fees,
        sum(case when indicator_name = 'subscribers' then indicator_value end) as subscribers,
        sum(case when indicator_name = 'submitted_products' then indicator_value end) as submitted_products,
        sum(case when indicator_name = 'new_vendors' then indicator_value end) as new_vendors,
        sum(case when indicator_name = 'active_vendors' then indicator_value end) as active_vendors,
        sum(case when indicator_name = 'returners' then indicator_value end) as returners,
        sum(case when indicator_name = 'refunds' then indicator_value end) as refunds,
        sum(case when indicator_name = 'discounts' then indicator_value end) as discounts,
        sum(case when indicator_name = 'gross_sales' then indicator_value end) as gross_sales,
        sum(case when indicator_name = 'bike_gmv' then indicator_value end) as bike_gmv


    from 
        {{ref('ecommerce_unioned_kpis')}}

    group by date, owner

)

select *
from ecommerce_kpis
