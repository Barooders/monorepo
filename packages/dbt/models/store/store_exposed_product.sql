{{
    config(
        materialized="incremental", unique_key="id", pre_hook="delete from {{this}}"
    )
}}

with
    dynamic_tags as (
        select
            da.name as name,
            pa.tag_prefix as tag_prefix,
            al.pim_product_attribute_order as priority
        from fivetran_strapi_public.pim_dynamic_attributes as da
        join
            fivetran_strapi_public.pim_dynamic_attributes_pim_product_attributes_links al
            on al.pim_dynamic_attribute_id = da.id
        join
            fivetran_strapi_public.pim_product_attributes pa
            on pa.id = al.pim_product_attribute_id
    ),
    images_ranked as (
        select
            images."productId",
            images.src as "firstImage",
            row_number() over (
                partition by images."productId" order by images."syncDate" desc
            ) as row_number
        from {{ ref("store_exposed_product_image") }} images
        where images.position = 1
    ),
    total_quantities as (
        select "productId", sum("quantity") as "totalQuantity"
        from public."ProductVariant"
        group by "productId"
    )

select
    bp.id as id,
    sp.published_at as "publishedAt",
    coalesce(p."productType", sp.product_type) as "productType",
    sp.title,
    sp.vendor,
    replace_phone_number(replace_links_and_mails(sp.body_html)) as "description",
    sp.handle,
    cast(p.status::text as dbt."ProductStatus") as status,
    t_brand.value as brand,
    coalesce(pr.traffictot, 0) as "numberOfViews",
    t_size.value as size,
    t_gender.value as gender,
    t_model.value as model,
    t_year.value as "modelYear",
    current_date as "syncDate",
    ir."firstImage" as "firstImage",
    coalesce(tq."totalQuantity", 0) as "total_quantity"

from {{ ref("store_base_product") }} bp
left join public."Product" p on p.id = bp.id
left join fivetran_shopify.product sp on sp.id = bp."shopifyId"

left join
    (
        select product_id, min(value) value
        from {{ ref("store_exposed_product_tag") }} t_brand
        where tag = 'marque'
        group by 1
    ) t_brand
    on t_brand.product_id = bp.id
left join
    (
        select product_id, min(t_size.value) value
        from {{ ref("store_exposed_product_tag") }} t_size
        join dynamic_tags dt on dt.tag_prefix = t_size.tag and dt.name = 'size'
        group by 1
    ) t_size
    on t_size.product_id = bp.id
left join
    (
        select product_id, min(value) value
        from {{ ref("store_exposed_product_tag") }} t_gender
        where tag = 'genre'
        group by 1
    ) t_gender
    on t_gender.product_id = bp.id
left join
    (
        select product_id, min(value) value
        from {{ ref("store_exposed_product_tag") }} t_model
        where tag = 'modele'
        group by 1
    ) t_model
    on t_model.product_id = bp.id
left join
    (
        select product_id, min(value) value
        from {{ ref("store_exposed_product_tag") }} t_year
        where tag = 'année'
        group by 1
    ) t_year
    on t_year.product_id = bp.id
left join images_ranked ir on ir."productId" = bp.id and ir.row_number = 1
left join total_quantities tq on tq."productId" = bp.id
left join
    biquery_analytics_dbt.products_ranking pr
    on pr.id = bp.id
    and pr._fivetran_deleted = false

where
    sp.id is not null
    and coalesce(p."productType", sp.product_type) is not null
    and sp.title is not null
