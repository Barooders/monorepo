{{ config(materialized='table') }}


WITH fact_order_line AS (
  SELECT
    shopify_order_line.id,
    shopify_order.id AS order_id,
    shopify_order.name AS order_name,
    DATETIME(shopify_order.created_at, 'Europe/Paris') AS creation_datetime,
    DATE_TRUNC(DATETIME(shopify_order.created_at, 'Europe/Paris'), DAY) AS creation_date,
    conversions_sources.`source` AS utm_source,
    conversions_sources.medium AS utm_medium,
    conversions_sources.campaign AS utm_campaign,
    conversions_sources.landing_page_path AS landing_page,
    conversions_sources.channel_grouping AS channel,
    CASE
      WHEN shopify_order.app_id = 13717602305 THEN 'mobile_application'
      WHEN shopify_order.app_id = 580111 THEN 'website'
      WHEN shopify_order.app_id = 1354745 THEN 'draft_orders'
      ELSE CAST(shopify_order.app_id AS STRING)
    END AS source,
    shopify_order.customer_id,
    shopify_order.confirmed,
    shopify_order_line.vendor,
    backend_customer.shopifyid AS vendor_id,
    shopify_order_line.product_id,
    shopify_order_line.variant_id,
    shopify_order.financial_status,
    shopify_order_line.gift_card,
    shopify_order_line.quantity,
    shopify_order_line.sku,
    shopify_order_line.price AS product_price,
    CASE WHEN shopify_order_line.rank = 1 THEN shopify_order.total_price ELSE 0 END AS total_price,
    CASE WHEN shopify_order_line.rank = 1 THEN shopify_order.total_discounts ELSE 0 END AS total_discounts,
    shopify_order_line.fulfillment_status,
    shopify_order_line.fulfillment_service,
    NOT COALESCE(refund.order_id IS null, false) AS is_refunded,
    DATETIME(fulfillment.created_at, 'Europe/Paris') AS fulfillment_date,
    fulfillment.shipment_status,
    fulfillment.tracking_company,
    CASE
      WHEN backend_customer.sellername = 'Barooders' THEN 'barooders'
      WHEN backend_customer.ispro IS true THEN 'b2c'
      ELSE 'c2c'
    END AS owner,
    DATE_DIFF(DATE_TRUNC(fulfillment.created_at, DAY), DATE_TRUNC(shopify_order.created_at, DAY), DAY) AS fulfillment_days,
    CASE WHEN shopify_order_line.rank = 1 THEN CAST(JSON_EXTRACT_SCALAR(shopify_order.total_shipping_price_set, '$.shop_money.amount') AS NUMERIC) ELSE 0 END AS shipping_amount,
    shopify_order.payment_gateway_names,
    shopify_order_line.refund_type
  FROM shopify.`order` shopify_order
  LEFT JOIN (
    SELECT
      shopify_order_line.*,
      olr.restock_type AS refund_type,
      RANK() OVER (PARTITION BY shopify_order_line.order_id ORDER BY shopify_order_line.id ASC) AS rank
    FROM shopify.order_line shopify_order_line
    LEFT JOIN shopify.order_line_refund olr ON shopify_order_line.id = olr.order_line_id
  ) shopify_order_line ON shopify_order.id = shopify_order_line.order_id
  LEFT JOIN shopify.fulfillment_order_line fulfillment_order_line ON shopify_order_line.id = fulfillment_order_line.order_line_id
  LEFT JOIN shopify.fulfillment fulfillment ON fulfillment_order_line.fulfillment_id = fulfillment.id
  LEFT JOIN (
    SELECT
      conversions_sources.transaction_id,
      conversions_sources.`date`,
      conversions_sources.`source`,
      conversions_sources.medium,
      conversions_sources.campaign,
      conversions_sources.landing_page_path,
      conversions_sources.channel_grouping,
      RANK() OVER (PARTITION BY transaction_id ORDER BY `date` ASC) AS rank
    FROM google_analytics.google_analytics_conversions_sources conversions_sources
  ) conversions_sources
    ON
      shopify_order.name = conversions_sources.transaction_id
      AND conversions_sources.rank = 1
  LEFT JOIN (SELECT DISTINCT order_id FROM shopify.refund) refund ON shopify_order.id = refund.order_id
  LEFT JOIN barooders_backend_dbt.store_product_for_analytics store_product_for_analytics ON shopify_order_line.product_id = store_product_for_analytics.shopify_id
  LEFT JOIN barooders_backend_public.customer backend_customer ON store_product_for_analytics.vendor_id = backend_customer.authuserid

		-- This filter out order lines cancelled at order level
  WHERE shopify_order.cancelled_at IS null
)

SELECT *
FROM fact_order_line
ORDER BY 3 DESC
