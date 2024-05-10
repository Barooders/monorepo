{{ config(materialized='table') }}

WITH fact_order_line_refund AS (
  SELECT
    refund.id,
    order_line_refund.order_line_id,
    refund.order_id,
    order_line_refund.quantity AS refund_quantity,
    order_line.quantity AS order_line_quantity,
    order_line.product_price AS order_line_product_price,
    order_line.total_discounts AS order_line_discounts,
    order_line.shipping_amount AS order_line_shipping_amount,
    order_line.owner,
    DATETIME(refund.created_at, 'Europe/Paris') AS creation_datetime,
    DATE_TRUNC(DATETIME(refund.created_at, 'Europe/Paris'), DAY) AS creation_date,
    order_line.quantity * order_line.product_price AS order_line_good_values,
    CASE
      WHEN order_line.id IS NOT null THEN order_line.total_price
      ELSE shopify_transaction.amount
    END AS order_total_amount,
    CASE
      WHEN order_line_refund.id IS NOT null THEN order_line_refund.subtotal
      ELSE shopify_transaction.amount
    END AS refund_total_amount
  FROM shopify.refund AS refund
  LEFT JOIN shopify.order_line_refund AS order_line_refund ON refund.id = order_line_refund.refund_id
  LEFT JOIN {{ ref('fact_order_line') }} AS order_line ON order_line_refund.order_line_id = order_line.id
  LEFT JOIN shopify.`transaction` AS shopify_transaction ON refund.id = shopify_transaction.refund_id

)

SELECT *
FROM fact_order_line_refund
ORDER BY 2 DESC
