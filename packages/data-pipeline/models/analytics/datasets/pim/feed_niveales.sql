{{ config(materialized='table') }}

SELECT
  f.variant_id AS id,
  m.slug AS type,
  f.barcode AS ean,
  "Achetez votre vélo neuf ou reconditionné sur Barooders, au meilleur prix. Jusqu'à -70% sur les meilleures marques." AS description,
  f.title_proper AS title,
  f.price,
  f_api.link,
  f.image_url_1 AS image_link,
  COALESCE(f.brand, "Barooders") AS brand,
  CASE
    WHEN p.year IN ("2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025") THEN p.year
    ELSE "2023"
  END AS year,
  COALESCE(p.modele, p.title) AS name
FROM {{ ref('feed_gmc') }} AS f
INNER JOIN {{ ref('feed_gmc_api') }} AS f_api ON f.variant_id = f_api.id
INNER JOIN {{ ref('dim_product') }} AS p ON f.product_id = p.id
INNER JOIN config.niveales_mapping AS m ON p.product_type = m.product_type
WHERE NOT (p.title IS null AND p.modele IS null)
