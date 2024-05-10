WITH crm_indicators AS (
  SELECT
    c.id,
    c.name AS campaign_name,
    m.name AS indicator_name,
    sent_date.sent_date,
    count(DISTINCT e.person_id) AS indicator_value
  FROM klaviyo.event AS e
  LEFT JOIN klaviyo.campaign AS c ON e.campaign_id = c.id
  LEFT JOIN klaviyo.metric AS m ON e.metric_id = m.id
  LEFT JOIN (SELECT
    e.campaign_id,
    min(e.`datetime`) AS sent_date
  FROM klaviyo.event AS e GROUP BY 1) AS sent_date ON e.campaign_id = sent_date.campaign_id
  WHERE m.id IN ('RqePhG', 'Un5xG3', 'Wavrcw', 'XxM2Y3', 'VKm9ty', 'TWVfX5')
  GROUP BY 1, 2, 3, 4
  ORDER BY 1 ASC
)


SELECT *
FROM crm_indicators
