WITH ecommerce_gross_sales_paid AS (

  SELECT
    o.owner,
    'gross_sales_paid' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    sum(o.product_price * o.quantity) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  WHERE o.financial_status != 'pending'
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_gross_sales_paid
