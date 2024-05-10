WITH product_tags AS (
  SELECT
    t.product_id,
    split(t.value, ':')[offset(0)] AS tag,
    t.value AS full_tag,
    min(split(t.value, ':')[offset(1)]) AS value
  FROM shopify.product_tag AS t
  WHERE regexp_contains(value, ':')
  GROUP BY 1, 2, 3
)

SELECT *
FROM product_tags
