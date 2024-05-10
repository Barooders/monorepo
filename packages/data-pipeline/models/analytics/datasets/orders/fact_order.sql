{{ config(materialized='table') }}


WITH fact_order AS (
  SELECT
    backend_order.id,
    backend_order.name AS order_name,
    backend_order.createdat AS creation_datetime,
    date_trunc(backend_order.createdat, DAY) AS creation_date,
    backend_order.shopifyid AS shopify_id,
    backend_order.customerid AS customer_id,
    customer.shopifyid AS customer_shopify_id,
    backend_order.customeremail AS customer_email,
    backend_order.shippingaddressfirstname AS shipping_address_first_name,
    backend_order.shippingaddresslastname AS shipping_address_last_name,
    backend_order.shippingaddresszip,
    backend_order.shippingaddresscity,
    backend_order.shippingaddressphone,
    backend_order.status
  FROM barooders_backend_public.`order` backend_order
  INNER JOIN barooders_backend_public.customer customer ON backend_order.customerid = customer.authuserid
)

SELECT *
FROM fact_order
ORDER BY creation_datetime DESC
