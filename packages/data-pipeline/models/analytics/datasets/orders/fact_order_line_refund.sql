{{ config(materialized='table') }}

with fact_order_line_refund as (
    select
        refund.id ,
        DATETIME(refund.created_at, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(refund.created_at, 'Europe/Paris'), day) as creation_date,
        order_line_refund.order_line_id,
        refund.order_id,
        order_line_refund.quantity as refund_quantity,
        order_line.quantity as order_line_quantity,
        order_line.product_price as order_line_product_price,
        order_line.total_discounts as order_line_discounts,
        order_line.shipping_amount as order_line_shipping_amount,
        order_line.quantity * order_line.product_price as order_line_good_values,
        order_line.owner as owner,
        case
            when order_line.id is not null then order_line.total_price
            else shopify_transaction.amount
        end as order_total_amount,
        case
            when order_line_refund.id is not null then order_line_refund.subtotal
            else shopify_transaction.amount
        end as refund_total_amount
    from shopify.refund refund
    left join shopify.order_line_refund order_line_refund on order_line_refund.refund_id = refund.id
    left join {{ref('fact_order_line')}} order_line on order_line.id = order_line_refund.order_line_id
    left join shopify.`transaction` shopify_transaction on shopify_transaction.refund_id = refund.id

)

select *
from fact_order_line_refund
order by 2 desc
