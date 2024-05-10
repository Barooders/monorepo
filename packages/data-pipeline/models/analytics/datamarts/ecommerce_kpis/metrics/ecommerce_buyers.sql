WITH ecommerce_buyers AS (

  SELECT
    o.owner,
    'buyers' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    count(DISTINCT o.customer_id) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_buyers
