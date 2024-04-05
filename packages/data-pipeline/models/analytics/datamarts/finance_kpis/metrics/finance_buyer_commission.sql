Select
    extract(date from ol.createdat) as date,
    c.sellername as vendor,
    ol.vendorid as vendor_id,
    ols.order_name as order_name,
    sum(ol.buyercommission) as buyer_commission,
from barooders_backend_public.orderlines as ol
join barooders_backend_public.customer as c on c.authuserid = ol.vendorid
join dbt.fact_order_line as ols on cast(ols.id as string) = ol.shopifyid
where ols.financial_status != 'pending'
group by date, order_name, vendor, vendor_id
order by date desc