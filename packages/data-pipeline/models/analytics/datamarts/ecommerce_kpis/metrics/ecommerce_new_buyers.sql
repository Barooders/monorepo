WITH ecommerce_new_buyers AS (

  SELECT
    o.owner,
    'new_buyers' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    count(DISTINCT o.customer_id) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  LEFT JOIN {{ ref('fact_order_line') }} AS o_before ON o.customer_id = o_before.customer_id AND o.creation_date > o_before.creation_date
  WHERE o_before.id IS null
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_new_buyers
