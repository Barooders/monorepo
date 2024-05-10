WITH orders AS (
  SELECT
    c.usedshipping,
    CASE WHEN vendor != 'Commission' THEN order_name END AS order_name,
    min(cast(creation_date AS date)) AS date,
    sum(CASE WHEN vendor != 'Commission' THEN shipping_amount END) AS shipping_paid,
    CASE WHEN vendor != 'Commission' THEN vendor END AS vendor,
    CASE WHEN vendor != 'Commission' THEN vendor_id END AS vendor_id
  FROM `direct-tribute-354315.dbt.fact_order_line` AS ol
  INNER JOIN barooders_backend_public.customer AS c ON ol.vendor_id = c.shopifyid
  WHERE financial_status != 'pending'
  GROUP BY order_name, vendor, vendor_id, usedshipping
)

SELECT
  date,
  vendor,
  vendor_id,
  order_name,
  usedshipping,
  sum(shipping_paid) AS shipping_paid
FROM orders
GROUP BY date, order_name, vendor, vendor_id, usedshipping
ORDER BY date DESC
