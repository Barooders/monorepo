WITH ecommerce_returners AS (

  SELECT
    o.owner,
    'returners' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    count(DISTINCT o.customer_id) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  LEFT JOIN {{ ref('fact_order_line') }} AS o_before ON o.customer_id = o_before.customer_id AND date_trunc(o_before.creation_date, DAY) < date_trunc(o.creation_date, DAY)
  WHERE o_before.id IS NOT null
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_returners
