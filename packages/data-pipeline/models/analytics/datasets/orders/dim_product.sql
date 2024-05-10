{{ config(materialized="table") }}

WITH
    dynamic_tags AS (
        SELECT
            da.name name,
            pa.tag_prefix tag_prefix,
            al.pim_product_attribute_order priority
        FROM strapi_public.pim_dynamic_attributes da
        JOIN
            strapi_public.pim_dynamic_attributes_pim_product_attributes_links al
            ON al.pim_dynamic_attribute_id = da.id
        JOIN
            strapi_public.pim_product_attributes pa
            ON pa.id = al.pim_product_attribute_id
    ),
    dim_product AS (
        SELECT
            p.id,
            b_product.id AS internal_id,
            datetime(p.created_at, 'Europe/Paris') AS creation_datetime,
            date_trunc(datetime(p.created_at, 'Europe/Paris'), day) AS creation_date,
            datetime(p.published_at, 'Europe/Paris') AS publication_datetime,
            date_trunc(
                datetime(p.published_at, 'Europe/Paris'), day
            ) AS publication_date,
            p.product_type,
            p.status,
            p.title,
            p.vendor,
            p.handle,
            c_vendor.shopifyid AS vendor_id,
            b_product.source AS source,
            b_product.notation AS scoring,
            CASE
                WHEN p.vendor = 'Commission'
                THEN 'commission'
                WHEN c_vendor.sellername = 'Barooders'
                THEN 'barooders'
                WHEN c_vendor.ispro IS true
                THEN 'b2c'
                ELSE 'c2c'
            END AS owner,
            pv.product_price,
            pv.compare_at_price,
            pv.inventory_quantity,
            t_brand.value AS brand,
            t_size.value AS size,
            t_gender.value AS gender,
            CASE
                WHEN b_product.condition_FROM_variants = 'AS_NEW'
                THEN 'Neuf'
                WHEN b_product.condition_FROM_variants = 'REFURBISHED_AS_NEW'
                THEN 'Neuf'
                WHEN b_product.condition_FROM_variants = 'VERY_GOOD'
                THEN 'Très bon état'
                ELSE 'Bon état'
            END AS etat,
            t_modele.value AS modele,
            t_year.value AS year,
            tags.tags,
            p.body_html AS body_html,
            current_date() AS sync_date,
            CASE
                WHEN date_diff(former_p.sync_date, current_date(), day) > 0
                THEN p.status
                ELSE former_p.status
            END AS former_status,
            CASE
                WHEN date_diff(former_p.sync_date, current_date(), day) > 0
                THEN pv.inventory_quantity
                ELSE former_p.inventory_quantity
            END AS former_quantity,
            date_diff(o.created_at, p.created_at, day) AS product_lifetime,
						cat.name AS parent_category

        FROM shopify.product p

        LEFT JOIN dbt.dim_product former_p ON former_p.id = p.id
        LEFT JOIN
            barooders_backend_dbt.store_product_for_analytics b_product
            ON b_product.shopify_id = p.id
        LEFT JOIN
            barooders_backend_public.customer c_vendor
            ON c_vendor.authuserid = b_product.vendor_id
        LEFT JOIN
            (
                SELECT product_id, min(value) value
                FROM {{ ref("product_tags") }} t_brand
                WHERE tag = 'marque'
                GROUP BY 1
            ) t_brand
            ON t_brand.product_id = p.id
        LEFT JOIN
            (
                SELECT product_id, t_size.value
                FROM {{ ref("product_tags") }} t_size
                JOIN dynamic_tags dt ON dt.tag_prefix = t_size.tag AND dt.name = 'size'
            ) t_size
            ON t_size.product_id = p.id
        LEFT JOIN
            (
                SELECT product_id, min(value) value
                FROM {{ ref("product_tags") }} t_gender
                WHERE tag = 'genre'
                GROUP BY 1
            ) t_gender
            ON t_gender.product_id = p.id
        LEFT JOIN
            (
                SELECT product_id, min(value) value
                FROM {{ ref("product_tags") }} t_modele
                WHERE tag = 'modele'
                GROUP BY 1
            ) t_modele
            ON t_modele.product_id = p.id
        LEFT JOIN
            (
                SELECT product_id, min(value) value
                FROM {{ ref("product_tags") }} t_year
                WHERE tag = 'année'
                GROUP by 1
            ) t_year
            ON t_year.product_id = p.id
        LEFT JOIN
            (
                SELECT t.product_id, string_agg(t.full_tag, ';') tags
                FROM {{ ref("product_tags") }} t
                GROUP by 1
            ) tags
            ON tags.product_id = p.id
        LEFT JOIN
            (
                SELECT
                    pv.product_id,
                    sum(pv.inventory_quantity) inventory_quantity,
                    min(pv.price) product_price,
                    min(pv.compare_at_price) compare_at_price
                FROM shopify.product_variant pv
                GROUP by pv.product_id
            ) pv
            ON pv.product_id = p.id

        LEFT JOIN
            shopify.order_line ol
            ON ol.product_id = p.id
            AND ol.fulfillment_status = 'fulfilled'
        LEFT JOIN shopify.order o ON o.id = ol.order_id AND o.financial_status = 'paid'
        LEFT JOIN strapi_public.pim_product_types ppt ON ppt.name = p.product_type
        LEFT JOIN strapi_public.pim_product_types_categories_links ppt_cat ON ppt_cat.pim_product_type_id = ppt.id
				LEFT JOIN strapi_public.pim_categories cat ON ppt_cat.pim_category_id = cat.id

        WHERE p.`_fivetran_deleted` IS false
    ),
    added_row_number AS (
        SELECT
            *,
            row_number() OVER (
                PARTITION BY id ORDER BY creation_datetime DESC
            ) AS row_number
        FROM dim_product
    )

SELECT *
FROM added_row_number
WHERE row_number = 1
