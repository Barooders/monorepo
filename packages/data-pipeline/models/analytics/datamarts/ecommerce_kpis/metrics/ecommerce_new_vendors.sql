WITH ecommerce_new_vendors AS (

  SELECT
    p.owner,
    'new_vendors' AS indicator_name,
    date_trunc(p.creation_date, DAY) AS date,
    count(DISTINCT p.vendor_id) AS indicator_value
  FROM {{ ref('dim_product') }} AS p
  LEFT JOIN {{ ref('dim_product') }} AS p_before ON p.vendor_id = p_before.vendor_id AND p.creation_date > p_before.creation_date AND p_before.status != 'draft'
  WHERE
    p_before.id IS null
    AND p.status != 'draft'
  GROUP BY date, owner, indicator_name

)

SELECT *
FROM ecommerce_new_vendors
