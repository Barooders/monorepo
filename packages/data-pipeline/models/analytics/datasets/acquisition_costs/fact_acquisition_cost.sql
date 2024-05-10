{{ config(materialized='table') }}

WITH fact_acquisition_cost AS (

  SELECT
    a.`date` AS date,
    'google' AS utm_source,
    'cpc' AS utm_medium,
    a.campaign_name AS utm_campaign,
    'Paid Search' AS channel,
    a.ad_group_name,
    ad_name,
    REGEXP_EXTRACT(a.ad_final_urls, r'\[(.+)\]') AS landing_page,
    'Google Ads' AS platform,
    SUM(a.clicks) AS clicks,
    SUM(a.impressions) AS impressions,
    SUM(a.cost_micros) / 1000000 AS spend,
    SUM(a.conversions) AS conversions
  FROM google_ads.google_ads_report AS a
  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9

  UNION ALL

  SELECT
    c.`date` AS date,
    'google' AS utm_source,
    'cpc' AS utm_medium,
    c.name AS utm_campaign,
    'Paid Search' AS channel,
    CAST(null AS STRING) AS ad_group_name,
    CAST(null AS STRING) AS ad_name,
    CAST(null AS STRING) AS landing_page,
    'Google Ads' AS platform,
    SUM(c.clicks) AS clicks,
    SUM(c.impressions) AS impressions,
    SUM(c.cost_micros) / 1000000 AS spend,
    SUM(c.conversions) AS conversions
  FROM google_ads.google_ads_campaign AS c
  LEFT JOIN google_ads.google_ads_report AS a ON c.name = a.campaign_name
  WHERE a.campaign_name IS null
  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9

  UNION ALL

  SELECT
    a.`date`,
    'facebook' AS utm_source,
    'cpc' AS utm_medium,
    a.campaign_name AS utm_campaign,
    'Paid Search' AS channel,
    a.adset_name,
    a.ad_name,
    CAST(null AS STRING) AS landing_page,
    'Facebook Ads' AS platform,
    SUM(a.clicks) AS clicks,
    SUM(a.impressions) AS impressions,
    SUM(a.spend) AS spend,
    COALESCE(SUM(conv.value), 0) AS conversions
  FROM facebook_ads.facebook_ads_ads AS a
  LEFT JOIN (SELECT
    ad_id,
    date,
    SUM(value) AS value
  FROM facebook_ads.facebook_ads_ads_conversions GROUP BY 1, 2) AS conv
    ON
      a.ad_id = conv.ad_id
      AND a.`date` = conv.`date`
  WHERE account_id = 316479733259152
  GROUP BY 1, 2, 3, 4, 5, 6, 7, 8, 9

)

SELECT *
FROM fact_acquisition_cost
ORDER BY 1 DESC
