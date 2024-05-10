WITH ecommerce_discounts AS (

  SELECT
    o.owner,
    'discounts' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    sum(o.total_discounts) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_discounts
