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
  FROM strapi.pim_dynamic_attributes AS da
  INNER JOIN
    strapi.pim_dynamic_attributes_pim_product_attributes_links AS al
    ON da.id = al.pim_dynamic_attribute_id
  INNER JOIN
    strapi.pim_product_attributes AS pa
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

SELECT -- noqa: ST06, (Select wildcards then simple targets before calculations and aggregates)
  bp.id,
  mp.updated_at AS "publishedAt",
  p."productType",
  mp.title,
  c."sellerName" AS vendor,
  replace_phone_number(replace_links_and_mails(mp.description)) AS "description",
  mp.handle,
  cast(cast(p.status AS text) AS dbt."ProductStatus") AS status,
  t_brand.value AS brand,
  coalesce(pr.traffictot, 0) AS "numberOfViews",
  t_size.value AS size,
  t_gender.value AS gender,
  t_model.value AS model, -- noqa: RF04, (ignore reserved keyword)
  t_year.value AS "modelYear",
  current_date AS "syncDate",
  ir."firstImage",
  coalesce(tq."totalQuantity", 0) AS "total_quantity"

FROM {{ ref("store_base_product") }} AS bp
LEFT JOIN public."Product" AS p ON bp.id = p.id
LEFT JOIN medusa.product AS mp ON bp."medusaId" = mp.id
LEFT JOIN public."Customer" AS c ON mp.vendor_id = cast(c."authUserId" AS text)
LEFT JOIN
  ( -- noqa: ST05, (Join/From clauses should not contain subqueries. Use CTEs instead)
    SELECT
      product_id,
      min(value) AS value -- noqa: RF04, (ignore reserved keyword)
    FROM {{ ref("store_exposed_product_tag") }}
    WHERE tag = 'marque'
    GROUP BY 1 -- noqa: AM06, (Inconsistent column references in GROUP BY/ORDER BY clauses)
  ) AS t_brand
  ON bp.id = t_brand.product_id
LEFT JOIN
  (
    SELECT
      product_id, -- noqa: RF02, (references should be qualified if select has more than one referenced table/view)
      min(t_size.value) AS value -- noqa: RF04, (ignore reserved keyword)
    FROM {{ ref("store_exposed_product_tag") }} AS t_size
    INNER JOIN
      dynamic_tags AS dt
      ON t_size.tag = dt.tag_prefix AND dt.name = 'size'
    GROUP BY 1 -- noqa: AM06, (Inconsistent column references in GROUP BY/ORDER BY clauses)
  ) AS t_size
  ON bp.id = t_size.product_id
LEFT JOIN
  (
    SELECT
      product_id,
      min(value) AS value -- noqa: RF04, (ignore reserved keyword)
    FROM {{ ref("store_exposed_product_tag") }}
    WHERE tag = 'genre'
    GROUP BY 1 -- noqa: AM06, (Inconsistent column references in GROUP BY/ORDER BY clauses)
  ) AS t_gender
  ON bp.id = t_gender.product_id
LEFT JOIN
  (
    SELECT
      product_id,
      min(value) AS value -- noqa: RF04, (ignore reserved keyword)
    FROM {{ ref("store_exposed_product_tag") }}
    WHERE tag = 'modele'
    GROUP BY 1 -- noqa: AM06, (Inconsistent column references in GROUP BY/ORDER BY clauses)
  ) AS t_model
  ON bp.id = t_model.product_id
LEFT JOIN
  (
    SELECT
      product_id,
      min(value) AS value -- noqa: RF04, (ignore reserved keyword)
    FROM {{ ref("store_exposed_product_tag") }}
    WHERE tag = 'année'
    GROUP BY 1 -- noqa: AM06, (Inconsistent column references in GROUP BY/ORDER BY clauses)
  ) AS t_year
  ON bp.id = t_year.product_id
LEFT JOIN images_ranked AS ir ON bp.id = ir."productId" AND ir.row_number = 1
LEFT JOIN total_quantities AS tq ON bp.id = tq."productId"
LEFT JOIN
  biquery_analytics_dbt.sync_products_ranking AS pr
  ON
    bp.id = pr.id

WHERE
  mp.id IS NOT null
  AND p."productType" IS NOT null
  AND mp.title IS NOT null
