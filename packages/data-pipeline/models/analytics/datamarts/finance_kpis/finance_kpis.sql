WITH finance_kpis AS (
  SELECT
    b.date,
    b.vendor,
    b.vendor_id,
    sum(b.buyer_commission) AS buyer_commission,
    sum(v.vendor_commission) AS vendor_commission,
    sum(s.shipping_paid) AS shipping_paid
  FROM {{ ref('finance_buyer_commission') }} AS b
  FULL JOIN {{ ref('finance_vendor_commission') }} AS v ON b.order_name = v.order_name
  FULL JOIN {{ ref('finance_shipping') }} AS s ON b.order_name = s.order_name
  GROUP BY date, vendor, vendor_id
--order by date desc, vendor desc
)

SELECT *
FROM finance_kpis
