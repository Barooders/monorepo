{{
    config(
        materialized="incremental", unique_key="id", pre_hook="delete from {{this}}"
    )
}}

WITH
dynamic_tags AS (
  SELECT
    da.name,
    pa.tag_prefix,
    al.pim_product_attribute_order AS priority
  FROM fivetran_strapi_public.pim_dynamic_attributes AS da
  INNER JOIN
    fivetran_strapi_public.pim_dynamic_attributes_pim_product_attributes_links AS al
    ON da.id = al.pim_dynamic_attribute_id
  INNER JOIN
    fivetran_strapi_public.pim_product_attributes AS pa
    ON al.pim_product_attribute_id = pa.id
),

images_ranked AS (
  SELECT
    images."productId",
    images.src AS "firstImage",
    row_number() OVER (
      PARTITION BY images."productId" ORDER BY images."syncDate" DESC
    ) AS row_number
  FROM {{ ref("store_exposed_product_image") }} AS images
  WHERE images.position = 1
),

total_quantities AS (
  SELECT
    "productId",
    sum("quantity") AS "totalQuantity"
  FROM public."ProductVariant"
  GROUP BY "productId"
)

SELECT
  bp.id,
  sp.published_at AS "publishedAt",
  coalesce(p."productType", sp.product_type) AS "productType",
  sp.title,
  sp.vendor,
  replace_phone_number(replace_links_and_mails(sp.body_html)) AS "description",
  sp.handle,
  cast(cast(p.status AS text) AS dbt."ProductStatus") AS status,
  t_brand.value AS brand,
  coalesce(pr.traffictot, 0) AS "numberOfViews",
  t_size.value AS size,
  t_gender.value AS gender,
  t_model.value AS model,
  t_year.value AS "modelYear",
  current_date AS "syncDate",
  ir."firstImage",
  coalesce(tq."totalQuantity", 0) AS "total_quantity"

FROM {{ ref("store_base_product") }} AS bp
LEFT JOIN public."Product" AS p ON bp.id = p.id
LEFT JOIN fivetran_shopify.product AS sp ON bp."shopifyId" = sp.id

LEFT JOIN
  (
    SELECT
      product_id,
      min(value) AS value
    FROM {{ ref("store_exposed_product_tag") }}
    WHERE tag = 'marque'
    GROUP BY 1
  ) AS t_brand
  ON bp.id = t_brand.product_id
LEFT JOIN
  (
    SELECT
      product_id,
      min(t_size.value) AS value
    FROM {{ ref("store_exposed_product_tag") }} AS t_size
    INNER JOIN
      dynamic_tags AS dt
      ON t_size.tag = dt.tag_prefix AND dt.name = 'size'
    GROUP BY 1
  ) AS t_size
  ON bp.id = t_size.product_id
LEFT JOIN
  (
    SELECT
      product_id,
      min(value) AS value
    FROM {{ ref("store_exposed_product_tag") }}
    WHERE tag = 'genre'
    GROUP BY 1
  ) AS t_gender
  ON bp.id = t_gender.product_id
LEFT JOIN
  (
    SELECT
      product_id,
      min(value) AS value
    FROM {{ ref("store_exposed_product_tag") }}
    WHERE tag = 'modele'
    GROUP BY 1
  ) AS t_model
  ON bp.id = t_model.product_id
LEFT JOIN
  (
    SELECT
      product_id,
      min(value) AS value
    FROM {{ ref("store_exposed_product_tag") }}
    WHERE tag = 'année'
    GROUP BY 1
  ) AS t_year
  ON bp.id = t_year.product_id
LEFT JOIN images_ranked AS ir ON bp.id = ir."productId" AND ir.row_number = 1
LEFT JOIN total_quantities AS tq ON bp.id = tq."productId"
LEFT JOIN
  biquery_analytics_dbt.products_ranking AS pr
  ON
    bp.id = pr.id
    AND pr._fivetran_deleted = false

WHERE
  sp.id IS NOT null
  AND coalesce(p."productType", sp.product_type) IS NOT null
  AND sp.title IS NOT null
