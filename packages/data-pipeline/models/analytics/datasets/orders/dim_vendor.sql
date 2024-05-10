{{ config(materialized='table') }}


WITH dim_vendor AS (
  SELECT DISTINCT
    b_c.shopifyid AS id,
    DATETIME(c.created_at, 'Europe/Paris') AS creation_datetime,
    DATE_TRUNC(DATETIME(c.created_at, 'Europe/Paris'), DAY) AS creation_date,
    c.state,
    CAST(b_c.ispro AS STRING) AS is_pro,
    b_c.sellername AS username,
    b_c.type,
    b_c.firstname,
    b_c.lastname,
    ca.country,
    c.email,
    b_c.scoring,
    b_c.usedshipping
  FROM shopify.product AS p
  LEFT JOIN barooders_backend_dbt.store_product_for_analytics AS b_p ON p.id = b_p.shopify_id
  LEFT JOIN barooders_backend_public.customer AS b_c ON b_p.vendor_id = b_c.authuserid
  LEFT JOIN shopify.customer AS c ON b_c.shopifyid = c.id
  LEFT JOIN shopify.customer_address AS ca ON c.id = ca.customer_id
  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
)

SELECT *
FROM dim_vendor
ORDER BY 2 DESC
