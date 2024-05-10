WITH ecommerce_refunds AS (

  SELECT
    r.owner,
    'refunds' AS indicator_name,
    date_trunc(r.creation_date, DAY) AS date,
    sum(r.order_total_amount) AS indicator_value
  FROM {{ ref('fact_order_line_refund') }} AS r
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_refunds
