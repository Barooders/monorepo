WITH orders as (
    SELECT
        case when vendor != 'Commission' then order_name else null end as order_name,
        min(cast(creation_date as date)) as date,
        sum(case when vendor != 'Commission' then shipping_amount else null end) as shipping_paid,
        case when vendor != 'Commission' then vendor else null end as vendor,
        case when vendor != 'Commission' then vendor_id else null end as vendor_id,
    c.usedshipping
    FROM `direct-tribute-354315.dbt.fact_order_line` as ol
    join backend__public.Customer as c on c.shopifyid = ol.vendor_id
    where financial_status != 'pending'
    group by order_name, vendor, vendor_id, usedshipping
)
Select
    date,
    vendor as vendor,
    vendor_id as vendor_id,
    order_name as order_name,
    sum(shipping_paid) as shipping_paid,
    usedshipping
from orders
group by date, order_name, vendor, vendor_id, usedshipping
order by date desc
