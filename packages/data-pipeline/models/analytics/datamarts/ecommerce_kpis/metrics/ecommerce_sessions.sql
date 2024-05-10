WITH ecommerce_sessions AS (

  SELECT
    t.`date`,
    cast(null AS string) AS owner,
    'sessions' AS indicator_name,
    sum(t.sessions) AS indicator_value
  FROM {{ ref('fact_traffic') }} AS t
  WHERE t.utm_source = 'all'
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_sessions
