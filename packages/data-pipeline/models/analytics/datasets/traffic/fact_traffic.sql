{{ config(materialized='table') }}

WITH all_traffic AS (
  SELECT
    'all' AS utm_source,
    'all' AS utm_medium,
    'all' AS utm_campaign,
    null AS landing_page,
    null AS channel,
    null AS sessions,
    null AS bounces,
    null AS session_duration,
    extract(DATE FROM c.time) AS date,
    count(DISTINCT c.mp_device_id) AS users
  FROM mixpanel_direct_export.mp_master_event AS c
  GROUP BY date, utm_source, utm_medium, utm_campaign, landing_page, channel
),

traffic AS (
  SELECT
    c.utm_source,
    c.utm_medium,
    c.utm_campaign,
    null AS landing_page,
    null AS channel,
    null AS sessions,
    null AS bounces,
    null AS session_duration,
    extract(DATE FROM c.time) AS date,
    count(DISTINCT c.mp_device_id) AS users
  FROM mixpanel_direct_export.mp_master_event AS c
  GROUP BY date, utm_source, utm_medium, utm_campaign, landing_page, channel
)

SELECT * FROM traffic
UNION ALL
SELECT * FROM all_traffic
ORDER BY date DESC
