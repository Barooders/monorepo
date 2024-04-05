with finance_revenue as (
    select
    date,
    sum(buyer_commission) + sum(vendor_commission) as commissions_revenue,
    sum(shipping_paid) as shipping_paid,
    sum(buyer_commission) + sum(vendor_commission) + sum(shipping_paid) as total_revenue,
    from dbt.finance_kpis
    group by date
)

Select
*
from finance_revenue