WITH ecommerce_shipping_fees AS (

  SELECT
    o.owner,
    'shipping_fees' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    sum(o.shipping_amount) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_shipping_fees
