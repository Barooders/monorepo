with finance_kpis as (
    Select
        b.date,
        b.vendor,
        b.vendor_id,
        sum(b.buyer_commission) as buyer_commission,
        sum(v.vendor_commission) as vendor_commission,
        sum(s.shipping_paid) as shipping_paid,
    from {{ref('finance_buyer_commission')}} b
    full join {{ref('finance_vendor_commission')}} v on v.order_name = b.order_name
    full join {{ref('finance_shipping')}} s on s.order_name = b.order_name
    group by date, vendor, vendor_id
    --order by date desc, vendor desc
)

Select
*
from finance_kpis