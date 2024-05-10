{{ config(materialized='table') }}


WITH dim_customer AS (
  SELECT
    c.id AS customer_id,
    c.email,
    max(datetime(c.created_at, 'Europe/Paris')) AS creation_datetime,
    max(date_trunc(datetime(c.created_at, 'Europe/Paris'), DAY)) AS creation_date,
    max(ca.first_name) AS first_name,
    max(ca.last_name) AS last_name,
    max(ca.country) AS country,
    max(ca.phone) AS phone,
    max(cast(b_c.ispro AS STRING)) AS is_pro,
    max(b_c.sellername) AS username,
    max(b_c.type) AS type
  FROM shopify.customer AS c
  LEFT JOIN shopify.customer_address AS ca ON c.id = ca.customer_id
  LEFT JOIN barooders_backend_public.customer AS b_c ON c.id = b_c.shopifyid
  GROUP BY c.id, c.email
)

SELECT *
FROM dim_customer
ORDER BY 2 DESC
