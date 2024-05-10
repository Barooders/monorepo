SELECT
  c.sellername AS vendor,
  ol.vendorid AS vendor_id,
  ols.order_name,
  extract(DATE FROM ol.createdat) AS date,
  sum(ol.vendorcommission) * -1 AS vendor_commission
FROM barooders_backend_public.orderlines AS ol
INNER JOIN barooders_backend_public.customer AS c ON ol.vendorid = c.authuserid
INNER JOIN dbt.fact_order_line AS ols ON cast(ols.id AS string) = ol.shopifyid
WHERE ols.financial_status != 'pending'
GROUP BY date, order_name, vendor, vendor_id
ORDER BY date DESC
