WITH ecommerce_paid_orders AS (

  SELECT
    o.owner,
    'paid_orders' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    count(DISTINCT o.order_id) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  WHERE vendor != 'Commission' AND financial_status != 'pending'
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_paid_orders
