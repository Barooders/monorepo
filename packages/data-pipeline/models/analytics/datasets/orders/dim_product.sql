{{ config(materialized="table") }}

with
    dynamic_tags as (
        select
            da.name name,
            pa.tag_prefix tag_prefix,
            al.pim_product_attribute_order priority
        from strapi_public.pim_dynamic_attributes da
        join
            strapi_public.pim_dynamic_attributes_pim_product_attributes_links al
            on al.pim_dynamic_attribute_id = da.id
        join
            strapi_public.pim_product_attributes pa
            on pa.id = al.pim_product_attribute_id
    ),
    dim_product as (
        select
            p.id,
            b_product.id as internal_id,
            datetime(p.created_at, 'Europe/Paris') as creation_datetime,
            date_trunc(datetime(p.created_at, 'Europe/Paris'), day) as creation_date,
            datetime(p.published_at, 'Europe/Paris') as publication_datetime,
            date_trunc(
                datetime(p.published_at, 'Europe/Paris'), day
            ) as publication_date,
            p.product_type,
            p.status,
            p.title,
            p.vendor,
            p.handle,
            c_vendor.shopifyid as vendor_id,
            b_product.source as source,
            b_product.notation as scoring,
            case
                when p.vendor = 'Commission'
                then 'commission'
                when c_vendor.sellername = 'Barooders'
                then 'barooders'
                when c_vendor.ispro is true
                then 'b2c'
                else 'c2c'
            end as owner,
            pv.product_price,
            pv.compare_at_price,
            pv.inventory_quantity,
            t_brand.value as brand,
            t_size.value as size,
            t_gender.value as gender,
            case
                when b_product.condition_from_variants = 'AS_NEW'
                then 'Neuf'
                when b_product.condition_from_variants = 'REFURBISHED_AS_NEW'
                then 'Neuf'
                when b_product.condition_from_variants = 'VERY_GOOD'
                then 'Très bon état'
                else 'Bon état'
            end as etat,
            t_modele.value as modele,
            t_year.value as year,
            tags.tags,
            p.body_html as body_html,
            current_date() as sync_date,
            case
                when date_diff(former_p.sync_date, current_date(), day) > 0
                then p.status
                else former_p.status
            end as former_status,
            case
                when date_diff(former_p.sync_date, current_date(), day) > 0
                then pv.inventory_quantity
                else former_p.inventory_quantity
            end as former_quantity,
            date_diff(o.created_at, p.created_at, day) as product_lifetime,
						cat.name AS parent_category

        from shopify.product p

        left join dbt.dim_product former_p on former_p.id = p.id
        left join
            barooders_backend_dbt.store_product_for_analytics b_product
            on b_product.shopify_id = p.id
        left join
            barooders_backend_public.customer c_vendor
            on c_vendor.authuserid = b_product.vendor_id
        left join
            (
                select product_id, min(value) value
                from {{ ref("product_tags") }} t_brand
                where tag = 'marque'
                group by 1
            ) t_brand
            on t_brand.product_id = p.id
        left join
            (
                select product_id, t_size.value
                from {{ ref("product_tags") }} t_size
                join dynamic_tags dt on dt.tag_prefix = t_size.tag and dt.name = 'size'
            ) t_size
            on t_size.product_id = p.id
        left join
            (
                select product_id, min(value) value
                from {{ ref("product_tags") }} t_gender
                where tag = 'genre'
                group by 1
            ) t_gender
            on t_gender.product_id = p.id
        left join
            (
                select product_id, min(value) value
                from {{ ref("product_tags") }} t_modele
                where tag = 'modele'
                group by 1
            ) t_modele
            on t_modele.product_id = p.id
        left join
            (
                select product_id, min(value) value
                from {{ ref("product_tags") }} t_year
                where tag = 'année'
                group by 1
            ) t_year
            on t_year.product_id = p.id
        left join
            (
                select t.product_id, string_agg(t.full_tag, ';') tags
                from {{ ref("product_tags") }} t
                group by 1
            ) tags
            on tags.product_id = p.id
        left join
            (
                select
                    pv.product_id,
                    sum(pv.inventory_quantity) inventory_quantity,
                    min(pv.price) product_price,
                    min(pv.compare_at_price) compare_at_price
                from shopify.product_variant pv
                group by pv.product_id
            ) pv
            on pv.product_id = p.id

        left join
            shopify.order_line ol
            on ol.product_id = p.id
            and ol.fulfillment_status = 'fulfilled'
        left join shopify.order o on o.id = ol.order_id and o.financial_status = 'paid'
        left join strapi_public.pim_product_types ppt on ppt.name = p.product_type
        left join strapi_public.pim_product_types_categories_links ppt_cat on ppt_cat.pim_product_type_id = ppt.id
				left join strapi_public.pim_categories cat on ppt_cat.pim_category_id = cat.id

        where p.`_fivetran_deleted` is false
    ),
    added_row_number as (
        select
            *,
            row_number() over (
                partition by id order by creation_datetime desc
            ) as row_number
        from dim_product
    )

select *
from added_row_number
where row_number = 1
