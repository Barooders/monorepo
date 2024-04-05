{{ config(materialized='table') }}

with dynamic_tags as (
    SELECT
        da.name name,
        pa.tag_prefix tag_prefix,
        al.pim_product_attribute_order priority
    FROM strapi_public.pim_dynamic_attributes da
    JOIN strapi_public.pim_dynamic_attributes_pim_product_attributes_links al ON al.pim_dynamic_attribute_id = da.id
    JOIN strapi_public.pim_product_attributes pa ON pa.id = al.pim_product_attribute_id
),
dim_product as (
    select
        p.id,
				b_product.id AS internal_id,
        DATETIME(p.created_at, 'Europe/Paris') as creation_datetime,
        date_trunc(DATETIME(p.created_at, 'Europe/Paris'), day) as creation_date,
        DATETIME(p.published_at, 'Europe/Paris') as publication_datetime,
        date_trunc(DATETIME(p.published_at, 'Europe/Paris'), day) as publication_date,
        p.product_type,
        p.status,
        p.title,
        p.vendor,
        p.handle,
        c_vendor.shopifyid as vendor_id,
        b_product.source as source,
        b_product.notation as scoring,
        case
          when p.vendor = 'Commission' then 'commission'
          when c_vendor.sellername = 'Barooders' then 'barooders'
          when c_vendor.ispro is true then 'b2c'
          else 'c2c'
          end as owner,
        pv.product_price,
        pv.compare_at_price,
        pv.inventory_quantity,
				t_brand.value as brand,
        t_size.value as size,
        t_gender.value as gender,
        CASE
          WHEN b_product.condition_from_variants = 'AS_NEW' THEN 'Neuf'
          WHEN b_product.condition_from_variants = 'REFURBISHED_AS_NEW' THEN 'Neuf'
          WHEN b_product.condition_from_variants = 'VERY_GOOD' THEN 'Très bon état'
          ELSE 'Bon état'
        END AS etat,
        t_modele.value as modele,
	      t_year.value as year,
        tags.tags,
        p.body_html as body_html,
        CURRENT_DATE() AS sync_date,
        CASE WHEN DATE_DIFF(former_p.sync_date, CURRENT_DATE(), DAY) > 0
          THEN p.status
          ELSE former_p.status
        END AS former_status,
        CASE WHEN DATE_DIFF(former_p.sync_date, CURRENT_DATE(), DAY) > 0
          THEN pv.inventory_quantity
          ELSE former_p.inventory_quantity
        END AS former_quantity,
        DATE_DIFF(o.created_at , p.created_at , DAY) as product_lifetime

    from shopify.product p

    left join dbt.dim_product former_p ON former_p.id = p.id
    left join barooders_backend_dbt.store_product_for_analytics b_product on b_product.shopify_id = p.id
    left join barooders_backend_public.customer c_vendor on c_vendor.authuserid = b_product.vendor_id
		left join (select product_id, min(value) value from {{ref('product_tags')}} t_brand where tag = 'marque' group by 1) t_brand on t_brand.product_id = p.id
    left join (select product_id, t_size.value from {{ref('product_tags')}} t_size JOIN dynamic_tags dt ON dt.tag_prefix = t_size.tag AND dt.name = 'size') t_size on t_size.product_id = p.id
    left join (select product_id, min(value) value from {{ref('product_tags')}} t_gender where tag = 'genre' group by 1) t_gender on t_gender.product_id = p.id
    left join (select product_id, min(value) value from {{ref('product_tags')}} t_modele where tag = 'modele' group by 1) t_modele on t_modele.product_id = p.id
    left join (select product_id, min(value) value from {{ref('product_tags')}} t_year where tag = 'année' group by 1) t_year on t_year.product_id = p.id
    left join (select t.product_id, string_agg(t.full_tag,';') tags from {{ref('product_tags')}} t group by 1) tags on tags.product_id = p.id
    left join (select pv.product_id, sum(pv.inventory_quantity) inventory_quantity, min(pv.price) product_price, min(pv.compare_at_price) compare_at_price from shopify.product_variant pv group by pv.product_id ) pv on pv.product_id = p.id

    left join shopify.order_line ol on ol.product_id  = p.id
    and ol.fulfillment_status = 'fulfilled'
    left join shopify.order o on o.id = ol.order_id
    and o.financial_status  = 'paid'

    where p.`_fivetran_deleted` is false
),
added_row_number AS (
  SELECT
    *,
    ROW_NUMBER() OVER(PARTITION BY id ORDER BY creation_datetime DESC) AS row_number
  FROM dim_product
)

SELECT
  *
FROM added_row_number
WHERE row_number = 1
