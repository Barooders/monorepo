{{ config(materialized='table') }}

WITH acquisition_kpis AS (

  SELECT
    COALESCE(k.`date`, o.`date`) AS date,
    COALESCE(k.utm_source, o.utm_source) AS utm_source,
    COALESCE(k.utm_medium, o.utm_medium) AS utm_medium,
    COALESCE(k.utm_campaign, o.utm_campaign) AS utm_campaign,
    --COALESCE(k.landing_page, o.landing_page) as landing_page,
    --COALESCE(k.channel, o.channel ) as channel,
    SUM(k.impressions) AS impressions,
    SUM(k.clicks) AS clicks,
    SUM(k.platforms_conversions) AS platforms_conversions,
    SUM(k.spend) AS spend,
    SUM(k.sessions) AS sessions,
    SUM(k.users) AS users,
    SUM(k.bounces) AS bounces,
    SUM(k.session_duration) AS session_duration,
    SUM(o.count_orders) AS shopify_conversions,
    SUM(o.count_paid_orders) AS shopify_paid_conversions,
    SUM(o.gmv) AS gmv,
    SUM(o.paid_gmv) AS paid_gmv
  FROM {{ ref('cost_traffic_kpis') }} AS k
  FULL OUTER JOIN (
    SELECT
      CAST(DATE_TRUNC(creation_date, DAY) AS date) AS date,
      utm_source,
      utm_medium,
      utm_campaign,
      --landing_page, 
      --channel, 
      SUM(total_price) AS gmv,
      SUM(CASE WHEN financial_status != 'pending' THEN total_price END) AS paid_gmv,
      COUNT(DISTINCT order_id) AS count_orders,
      COUNT(DISTINCT CASE WHEN financial_status != 'pending' THEN order_id END) AS count_paid_orders
    FROM dbt.fact_order_line
    GROUP BY 1, 2, 3, 4

    UNION ALL

    SELECT
      CAST(DATE_TRUNC(creation_date, DAY) AS date) AS date,
      'all',
      'all',
      'all',
      SUM(total_price) AS gmv,
      SUM(CASE WHEN financial_status != 'pending' THEN total_price END) AS paid_gmv,
      COUNT(DISTINCT order_id) AS count_orders,
      COUNT(DISTINCT CASE WHEN financial_status != 'pending' THEN order_id END) AS count_paid_orders
    FROM dbt.fact_order_line
    GROUP BY 1, 2, 3, 4
  ) AS o
    ON
      k.date = o.`date`
      AND k.utm_source = o.utm_source
      AND k.utm_medium = o.utm_medium
      AND k.utm_campaign = o.utm_campaign
  --and k.landing_page = o.landing_page 
  --and k.channel = o.channel 
  GROUP BY 1, 2, 3, 4
)

SELECT *
FROM acquisition_kpis
ORDER BY date DESC
