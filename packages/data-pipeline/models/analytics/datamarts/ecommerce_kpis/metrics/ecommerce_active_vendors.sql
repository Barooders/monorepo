WITH ecommerce_active_vendors AS (

  SELECT
    p.owner,
    'active_vendors' AS indicator_name,
    date_trunc(p.creation_date, DAY) AS date,
    count(DISTINCT p.vendor_id) AS indicator_value
  FROM {{ ref('dim_product') }} AS p
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_active_vendors
