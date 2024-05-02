{{ config(materialized='table') }}


with fact_order as (
    select
        order.id,
        order.name as order_name,
        order.createdat as creation_datetime,
        date_trunc(order.createdat, day) as creation_date,
        order.shopifyid as shopify_id,
        order.customerid as customer_id,
        customer.shopifyid as customer_shopify_id,
        order.customeremail as customer_email,
        order.shippingaddressfirstname as shipping_address_first_name,
        order.shippingaddresslastname as shipping_address_last_name,
        order.shippingaddresszip,
        order.shippingaddresscity,
        order.shippingaddressphone,
        order.status as status,
        from barooders_backend_public.order order
        join barooders_backend_public.customer customer on customer.authuserid = order.customerid
)

select *
from fact_order
order by creation_datetime desc
