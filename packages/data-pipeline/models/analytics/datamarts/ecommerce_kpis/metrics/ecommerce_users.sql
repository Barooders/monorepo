WITH ecommerce_users AS (

  SELECT
    t.`date`,
    cast(null AS string) AS owner,
    'users' AS indicator_name,
    sum(t.users) AS indicator_value

  FROM {{ ref('fact_traffic') }} AS t
  WHERE utm_campaign = 'all' AND utm_medium = 'all' AND utm_source = 'all'
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_users
