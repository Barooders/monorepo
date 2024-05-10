WITH ecommerce_gmv AS (

  SELECT
    o.owner,
    'gmv' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    sum(o.total_price) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_gmv
