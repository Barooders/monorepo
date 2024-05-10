{{ config(materialized='table') }}

WITH crm_kpis AS (

  SELECT
    campaign_name,
    sent_date,
    sum(CASE WHEN indicator_name = 'Opened Email' THEN indicator_value END) AS unique_openers,
    sum(CASE WHEN indicator_name = 'Bounced Email' THEN indicator_value END) AS bounced_emails,
    sum(CASE WHEN indicator_name = 'Received Email' THEN indicator_value END) AS received_emails,
    sum(CASE WHEN indicator_name = 'Bounced Email' OR indicator_name = 'Received Email' THEN indicator_value END) AS recipients,
    sum(CASE WHEN indicator_name = 'Clicked Email' THEN indicator_value END) AS unique_clickers,
    sum(CASE WHEN indicator_name = 'Unsubscribed' THEN indicator_value END) AS unsubscribers

  FROM
    {{ ref('crm_indicators') }}

  GROUP BY 1, 2

)

SELECT *
FROM crm_kpis
