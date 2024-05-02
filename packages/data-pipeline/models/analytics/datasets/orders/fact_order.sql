{{ config(materialized='table') }}


with fact_order as (
    select
        backend_order.id,
        backend_order.name as order_name,
        backend_order.createdat as creation_datetime,
        date_trunc(backend_order.createdat, day) as creation_date,
        backend_order.shopifyid as shopify_id,
        backend_order.customerid as customer_id,
        customer.shopifyid as customer_shopify_id,
        backend_order.customeremail as customer_email,
        backend_order.shippingaddressfirstname as shipping_address_first_name,
        backend_order.shippingaddresslastname as shipping_address_last_name,
        backend_order.shippingaddresszip,
        backend_order.shippingaddresscity,
        backend_order.shippingaddressphone,
        backend_order.status as status,
        from barooders_backend_public.order backend_order
        join barooders_backend_public.customer customer on customer.authuserid = backend_order.customerid
)

select *
from fact_order
order by creation_datetime desc
