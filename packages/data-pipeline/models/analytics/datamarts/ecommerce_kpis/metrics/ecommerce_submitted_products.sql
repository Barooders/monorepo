WITH ecommerce_submitted_products AS (

  SELECT
    p.owner,
    'submitted_products' AS indicator_name,
    date_trunc(p.creation_date, DAY) AS date,
    count(DISTINCT p.id) AS indicator_value
  FROM {{ ref('dim_product') }} AS p
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_submitted_products
