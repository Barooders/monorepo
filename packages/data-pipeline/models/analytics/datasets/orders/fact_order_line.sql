{{ config(materialized='table') }}


with fact_order_line as (
    select
        shopify_order_line.id,
        o.id as order_id,
        o.name as order_name,
        DATETIME(o.created_at, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(o.created_at, 'Europe/Paris'), day) as creation_date,
        c.`source` as utm_source,
        c.medium as utm_medium,
        c.campaign as utm_campaign,
        c.landing_page_path as landing_page,
        c.channel_grouping as channel,
        CASE
          WHEN o.app_id = 13717602305 THEN 'mobile_application'
          WHEN o.app_id = 580111 THEN 'website'
          WHEN o.app_id = 1354745 THEN 'draft_orders'
          ELSE CAST( o.app_id AS STRING )
        END AS source,
        o.customer_id,
        o.confirmed,
        shopify_order_line.vendor,
        b_c.shopifyid as vendor_id,
        shopify_order_line.product_id,
        shopify_order_line.variant_id,
        o.financial_status,
        shopify_order_line.gift_card,
        shopify_order_line.quantity,
        shopify_order_line.sku,
        shopify_order_line.price as product_price,
        case when shopify_order_line.rank = 1 then o.total_price else 0 end as total_price,
        case when shopify_order_line.rank = 1 then o.total_discounts else 0 end as total_discounts,
        shopify_order_line.fulfillment_status,
        shopify_order_line.fulfillment_service,
        case when r.order_id is null then false else true end as is_refunded,
        DATETIME(f.created_at, 'Europe/Paris') as fulfillment_date,
        f.shipment_status,
        f.tracking_company,
        CASE
          when b_c.sellername = 'Barooders' then 'barooders'
          when b_c.ispro is true then 'b2c'
          else 'c2c'
        END as owner,
        DATE_DIFF(date_trunc(f.created_at, day), date_trunc(o.created_at, day), day) as fulfillment_days,
        case when shopify_order_line.rank = 1 then CAST(JSON_EXTRACT_SCALAR(o.total_shipping_price_set, '$.shop_money.amount') AS NUMERIC) else 0 end as shipping_amount,
				o.payment_gateway_names,
				shopify_order_line.refund_type
    from shopify.order o
		left join (
      select
        shopify_order_line.*,
				olr.restock_type AS refund_type,
        RANK() OVER (PARTITION BY shopify_order_line.order_id ORDER BY shopify_order_line.id ASC) AS rank
      from shopify.order_line shopify_order_line
      left join shopify.order_line_refund olr on olr.order_line_id = shopify_order_line.id
    ) shopify_order_line on shopify_order_line.order_id = o.id
		left join shopify.fulfillment_order_line fol on fol.order_line_id = shopify_order_line.id
    left join shopify.fulfillment f on f.id = fol.fulfillment_id
    left join (
        select
            c.transaction_id,
            c.`date` ,
            c.`source`,
            c.medium,
            c.campaign,
            c.landing_page_path,
            c.channel_grouping,
            RANK() OVER (PARTITION BY transaction_id ORDER BY `date` ASC) as rank
        from google_analytics.google_analytics_conversions_sources c) c
    on c.transaction_id = o.name
    and c.rank = 1
    left join (select distinct order_id from shopify.refund) r on r.order_id = o.id
    left join barooders_backend_dbt.store_product_for_analytics b_p on b_p.shopify_id = shopify_order_line.product_id
    left join barooders_backend_public.customer b_c on b_c.authuserid = b_p.vendor_id

		-- This filter out order lines cancelled at order level
		WHERE o.cancelled_at IS NULL
)

select *
from fact_order_line
order by 3 desc
