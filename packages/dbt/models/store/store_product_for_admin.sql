{{ config(
    materialized='incremental',
    unique_key='id',
    pre_hook='delete from {{this}}'
) }}

SELECT
    sbp.id AS id,
    bp."sourceUrl" AS "source_url"

FROM {{ref('store_base_product')}} sbp
LEFT JOIN public."Product" bp ON sbp.id = bp.id
