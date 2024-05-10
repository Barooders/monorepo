WITH ecommerce_shipping_fees_paid AS (

  SELECT
    o.owner,
    'shipping_fees_paid' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    sum(o.shipping_amount) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  WHERE o.financial_status != 'pending'
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_shipping_fees_paid
