{{ config(materialized='table') }}

with fact_order_line_refund as (
    select
        refund.id ,
        DATETIME(refund.created_at, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(refund.created_at, 'Europe/Paris'), day) as creation_date,
        olr.order_line_id,
        refund.order_id,
        olr.quantity as refund_quantity,
        order_line.quantity as order_line_quantity,
        order_line.product_price as order_line_product_price,
        order_line.total_discounts as order_line_discounts,
        order_line.shipping_amount as order_line_shipping_amount,
        order_line.quantity * order_line.product_price as order_line_good_values,
        order_line.owner as owner,
        case
            when order_line.id is not null then order_line.total_price
            else t.amount
        end as order_total_amount,
        case
            when olr.id is not null then olr.subtotal
            else t.amount
        end as refund_total_amount
    from shopify.refund refund
    left join shopify.order_line_refund olr on olr.refund_id = refund.id
    left join {{ref('fact_order_line')}} order_line on order_line.id = olr.order_line_id
    left join shopify.`transaction` t on t.refund_id = refund.id

)

select *
from fact_order_line_refund
order by 2 desc
