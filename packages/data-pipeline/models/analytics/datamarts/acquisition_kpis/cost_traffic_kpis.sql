WITH cost_traffic_kpis AS (

  SELECT
    COALESCE(costs.`date`, traffic.`date`) AS date,
    COALESCE(costs.utm_source, traffic.utm_source) AS utm_source,
    COALESCE(costs.utm_medium, traffic.utm_medium) AS utm_medium,
    COALESCE(costs.utm_campaign, traffic.utm_campaign) AS utm_campaign,
    --COALESCE(REGEXP_EXTRACT(costs.landing_page, r'barooders.com(.+)$'), traffic.landing_page) as landing_page,
    --COALESCE(costs.channel, traffic.channel ) as channel,
    SUM(costs.impressions) AS impressions,
    SUM(costs.clicks) AS clicks,
    SUM(costs.conversions) AS platforms_conversions,
    SUM(costs.spend) AS spend,
    SUM(traffic.users) AS users,
    SUM(traffic.bounces) AS bounces,
    SUM(traffic.session_duration) AS session_duration,
    SUM(traffic.sessions) AS sessions
  FROM (
    SELECT
      date,
      utm_source,
      utm_medium,
      utm_campaign,
      SUM(sessions) AS sessions,
      SUM(users) AS users,
      SUM(bounces) AS bounces,
      SUM(session_duration) AS session_duration
    FROM {{ ref('fact_traffic') }}
    GROUP BY 1, 2, 3, 4
  ) AS traffic
  FULL OUTER JOIN (
    SELECT
      date,
      utm_source,
      utm_medium,
      utm_campaign,
      REGEXP_EXTRACT(landing_page, r'barooders.com(.+)$') AS landing_page,
      channel,
      SUM(impressions) AS impressions,
      SUM(conversions) AS conversions,
      SUM(spend) AS spend,
      SUM(clicks) AS clicks
    FROM {{ ref('fact_acquisition_cost') }}
    GROUP BY 1, 2, 3, 4, 5, 6
    UNION ALL
    SELECT
      date,
      'all',
      'all',
      'all',
      'all',
      'all',
      SUM(impressions) AS impressions,
      SUM(conversions) AS conversions,
      SUM(spend) AS spend,
      SUM(clicks) AS clicks
    FROM {{ ref('fact_acquisition_cost') }}
    GROUP BY 1, 2, 3, 4, 5, 6
  ) AS costs
    ON
      traffic.`date` = costs.date
      AND traffic.utm_source = costs.utm_source
      AND traffic.utm_medium = costs.utm_medium
      AND traffic.utm_campaign = costs.utm_campaign
  --and costs.landing_page = traffic.landing_page 
  --and costs.channel = traffic.channel 
  GROUP BY 1, 2, 3, 4

)

SELECT *
FROM cost_traffic_kpis
