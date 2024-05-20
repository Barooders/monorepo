{{ config(materialized='table') }}


with fact_order_line as (
    select
        shopify_order_line.id,
        shopify_order.id as order_id,
        shopify_order.name as order_name,
        DATETIME(shopify_order.created_at, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(shopify_order.created_at, 'Europe/Paris'), day) as creation_date,
        conversions_sources.`source` as utm_source,
        conversions_sources.medium as utm_medium,
        conversions_sources.campaign as utm_campaign,
        conversions_sources.landing_page_path as landing_page,
        conversions_sources.channel_grouping as channel,
        CASE
          WHEN shopify_order.app_id = 13717602305 THEN 'mobile_application'
          WHEN shopify_order.app_id = 580111 THEN 'website'
          WHEN shopify_order.app_id = 1354745 THEN 'draft_orders'
          ELSE CAST( shopify_order.app_id AS STRING )
        END AS source,
        shopify_order.customer_id,
        shopify_order.confirmed,
        shopify_order_line.vendor,
        backend_customer.shopifyid as vendor_id,
        shopify_order_line.product_id,
        shopify_order_line.variant_id,
        shopify_order.financial_status,
        shopify_order_line.gift_card,
        shopify_order_line.quantity,
        shopify_order_line.sku,
        shopify_order_line.price as product_price,
        case when shopify_order_line.rank = 1 then shopify_order.total_price else 0 end as total_price,
        case when shopify_order_line.rank = 1 then shopify_order.total_discounts else 0 end as total_discounts,
        shopify_order_line.fulfillment_status,
        shopify_order_line.fulfillment_service,
        case when refund.order_id is null then false else true end as is_refunded,
        DATETIME(fulfillment.created_at, 'Europe/Paris') as fulfillment_date,
        fulfillment.shipment_status,
        fulfillment.tracking_company,
        CASE
          when backend_customer.sellername = 'Barooders' then 'barooders'
          when backend_customer.ispro is true then 'b2c'
          else 'c2c'
        END as owner,
        DATE_DIFF(date_trunc(fulfillment.created_at, day), date_trunc(shopify_order.created_at, day), day) as fulfillment_days,
        case when shopify_order_line.rank = 1 then CAST(JSON_EXTRACT_SCALAR(shopify_order.total_shipping_price_set, '$.shop_money.amount') AS NUMERIC) else 0 end as shipping_amount,
				shopify_order.payment_gateway_names,
				shopify_order_line.refund_type
    from shopify.order shopify_order
		left join (
      select
        shopify_order_line.*,
				olr.restock_type AS refund_type,
        RANK() OVER (PARTITION BY shopify_order_line.order_id ORDER BY shopify_order_line.id ASC) AS rank
      from shopify.order_line shopify_order_line
      left join shopify.order_line_refund olr on olr.order_line_id = shopify_order_line.id
    ) shopify_order_line on shopify_order_line.order_id = shopify_order.id
		left join shopify.fulfillment_order_line fulfillment_order_line on fulfillment_order_line.order_line_id = shopify_order_line.id
    left join shopify.fulfillment fulfillment on fulfillment.id = fulfillment_order_line.fulfillment_id
    left join (
        select
            conversions_sources.transaction_id,
            conversions_sources.`date` ,
            conversions_sources.`source`,
            conversions_sources.medium,
            conversions_sources.campaign,
            conversions_sources.landing_page_path,
            conversions_sources.channel_grouping,
            RANK() OVER (PARTITION BY transaction_id ORDER BY `date` ASC) as rank
        from google_analytics.google_analytics_conversions_sources conversions_sources) conversions_sources
    on conversions_sources.transaction_id = shopify_order.name
    and conversions_sources.rank = 1
    left join (select distinct order_id from shopify.refund) refund on refund.order_id = shopify_order.id
    left join backend__dbt.store_product_for_analytics store_product_for_analytics on store_product_for_analytics.shopify_id = shopify_order_line.product_id
    left join backend__public.Customer backend_customer on backend_customer.authuserid = store_product_for_analytics.vendor_id

		-- This filter out order lines cancelled at order level
		WHERE shopify_order.cancelled_at IS NULL
)

select *
from fact_order_line
order by 3 desc
