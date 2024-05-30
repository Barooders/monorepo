{{ config(materialized='table') }}

with unique_variant_feed as (
	SELECT
		row.*,
		row.variant_id AS id
	FROM (
		SELECT ARRAY_AGG(f LIMIT 1)[OFFSET(0)] row
		FROM {{ref('feed_gmc')}} as f
		where
        not contains_substr(tags, 'exclude')
        and not image_url_1 is null
		GROUP BY variant_id
	)
),
stocks as (
    SELECT
        id,
        case
            when product_status != 'active' or inventory_quantity = 0 then 'out_of_stock'
            else 'in_stock'
            end as availability
    FROM unique_variant_feed
),
shipping_price as (
    SELECT
        id,
        case
            when forced_shipping_price is not null then forced_shipping_price + commission_price + 0.1
            else sh.shipping_price + commission_price + 0.1
        end as shipping_price
    FROM unique_variant_feed AS f
    JOIN config.shipping_weights as sh on sh.weight = f.weight
),
slugs as (
    SELECT
			id,
			slug.collection_slug,
			concat('https://barooders.com/collections/', COALESCE(slug.collection_slug, "all"), '?handle=', f.handle, '&cache=false&utm_source=google&utm_medium=cpc&variant=', variant_internal_id) as link
	FROM unique_variant_feed AS f
	LEFT JOIN config.product_type_slug as slug on slug.product_type = f.product_type
),
image_1 as (
    SELECT
        id,
        COALESCE(img.image_url, f.image_url_1) as image_url
    FROM unique_variant_feed AS f
    LEFT JOIN smartfeeds.product_images_no_background as img on img.product_id = cast(f.product_id as string)
)

SELECT
    f.id,
    f.product_id as item_group_id,
    case
        when f.product_description is null then '<p>Les prix les moins chers du marché sont sur barooders.com</p><p>Qualité et service garantis</p>'
        when CHAR_LENGTH(f.product_description) >= 5000 then SUBSTR(f.product_description, 1, 5000)
        else f.product_description
        end as description,
    st.availability as availability,
    case when f.brand is null then 'Barooders' else f.brand end as brand,
    f.etat as condition,
    f.size,
    f.weight,
    image_1.image_url as image_link,
    concat(case
        when f.compare_at_price is not null and f.compare_at_price > f.price then f.compare_at_price
        else f.price
        end, ' EUR') as price,
    concat(case
        when f.compare_at_price is not null and f.compare_at_price > f.price then f.price
        else f.price
        end, ' EUR') as  sale_price,
    'France' as shipping_country,
    concat('FR:::', sh.shipping_price, ' EUR') as shipping,
    sl.link,
    f.title_proper as title,
    ARRAY_TO_STRING([f.image_url_2, f.image_url_3, f.image_url_4, f.image_url_5, f.image_url_6], ",") as additional_image_link,
    f.barcode gtin,
    f.google_type as product_type,
    f.custom_label_0

FROM unique_variant_feed AS f
JOIN stocks st on st.id = f.id
JOIN shipping_price sh on sh.id = f.id
JOIN slugs sl on sl.id = f.id
JOIN config.feed_google_categories as gcat on gcat.product_category = f.product_category
JOIN image_1 on image_1.id = f.id