{{ config(
    materialized='incremental',
    unique_key="id",
    pre_hook='delete from {{this}}'
) }}

SELECT
  bc.id,
  bc."medusaId" AS medusa_id,
  bc.title,
  bc.handle
FROM public."Collection" AS bc
WHERE bc.title IS NOT NULL AND bc.handle IS NOT NULL
