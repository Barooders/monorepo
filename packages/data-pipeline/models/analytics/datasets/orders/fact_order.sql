{{ config(materialized='table') }}


with fact_order as (
    select
        o.id,
        o.name as order_name,
        o.createdat as creation_datetime,
        date_trunc(o.createdat, day) as creation_date,
        o.shopifyid as shopify_id,
        o.customerid as customer_id,
        c.shopifyid as customer_shopify_id,
        o.customeremail as customer_email,
        o.shippingaddressfirstname as shipping_address_first_name,
        o.shippingaddresslastname as shipping_address_last_name,
        o.shippingaddresszip,
        o.shippingaddresscity,
        o.shippingaddressphone,
        o.status as status,
        from barooders_backend_public.order o
        join barooders_backend_public.customer c on c.authuserid = o.customerid
)

select *
from fact_order
order by creation_datetime desc
