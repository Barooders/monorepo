WITH ecommerce_orders AS (

  SELECT
    o.owner,
    'orders' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    count(DISTINCT o.order_id) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  WHERE vendor != 'Commission'
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_orders
