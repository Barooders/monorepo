{{ config(
    materialized='incremental',
    unique_key="id",
    pre_hook='delete from {{this}}'
) }}

SELECT
  bc.id AS id,
  bc."shopifyId"::bigint AS shopify_id,
  bc.title AS title,
  bc.handle AS handle
FROM public."Collection" bc
WHERE bc.title IS NOT NULL and bc.handle IS NOT NULL
