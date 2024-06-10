{{ config(
   materialized='incremental',
  unique_key="product_id||'-'||full_tag",
  pre_hook='delete from {{this}}'
) }}

SELECT
    id AS product_id,
		tag AS full_tag,
    (regexp_split_to_array(tag, ':'))[1] AS tag,
    (regexp_split_to_array(tag, ':'))[2] AS value -- noqa: RF04, (ignore reserved keyword)
FROM (
    SELECT
        bp.id,
        jsonb_array_elements_text(p.metadata->'tags') AS tag
    FROM
        {{ ref('store_base_product') }} AS bp
		JOIN medusa.product p ON p.id = bp."medusaId"
) AS tags_split
WHERE tag LIKE '%:%'