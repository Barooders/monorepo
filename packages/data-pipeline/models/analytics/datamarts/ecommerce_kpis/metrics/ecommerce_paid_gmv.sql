WITH ecommerce_paid_gmv AS (

  SELECT
    o.owner,
    'paid_gmv' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    sum(o.total_price) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  WHERE o.financial_status != 'pending'
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_paid_gmv
