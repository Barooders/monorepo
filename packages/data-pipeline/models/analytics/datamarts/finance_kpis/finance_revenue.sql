WITH finance_revenue AS (
  SELECT
    date,
    sum(buyer_commission) + sum(vendor_commission) AS commissions_revenue,
    sum(shipping_paid) AS shipping_paid,
    sum(buyer_commission) + sum(vendor_commission) + sum(shipping_paid) AS total_revenue
  FROM dbt.finance_kpis
  GROUP BY date
)

SELECT *
FROM finance_revenue
