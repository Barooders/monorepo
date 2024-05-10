WITH ecommerce_subscribers AS (

  SELECT
    date_trunc(creation_date, DAY) AS date,
    cast(null AS string) AS owner,
    'subscribers' AS indicator_name,
    sum(subscribers) AS indicator_value
  FROM (
    SELECT
      c.creation_date,
      count(DISTINCT c.customer_id) AS subscribers
    FROM {{ ref('dim_customer') }} AS c
    GROUP BY 1
    UNION ALL
    SELECT
      v.creation_date,
      count(DISTINCT v.id) AS subscribers
    FROM {{ ref('dim_vendor') }} AS v
    GROUP BY 1
  )
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_subscribers
