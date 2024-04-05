{{ config(materialized='table') }}

with fact_order_line_refund as (
    
    select 
        r.id ,
        DATETIME(r.created_at, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(r.created_at, 'Europe/Paris'), day) as creation_date,
        olr.order_line_id,
        r.order_id,
        olr.quantity as refund_quantity,
        ol.quantity as order_line_quantity,
        ol.product_price as order_line_product_price,
        ol.total_discounts as order_line_discounts,
        ol.shipping_amount as order_line_shipping_amount,
        ol.quantity * ol.product_price as order_line_good_values,
        ol.owner as owner,
        case 
            when ol.id is not null then ol.total_price 
            else t.amount 
        end as order_total_amount,
        case 
            when olr.id is not null then olr.subtotal 
            else t.amount 
        end as refund_total_amount
    from shopify.refund r
    left join shopify.order_line_refund olr on olr.refund_id = r.id
    left join {{ref('fact_order_line')}} ol on ol.id = olr.order_line_id
    left join shopify.`transaction` t on t.refund_id = r.id 

)

select *
from fact_order_line_refund
order by 2 desc
