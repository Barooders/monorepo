{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
  sbp.id,
  bp."sourceUrl" AS "source_url"

FROM {{ ref('store_base_product') }} AS sbp
LEFT JOIN public."Product" AS bp ON sbp.id = bp.id
