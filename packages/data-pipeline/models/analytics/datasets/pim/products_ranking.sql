{{ config(
    materialized='table',
    primary_key='id'
) }}

WITH

TRAFFIC30 as (
    SELECT
        productid,
        count(distinct mp_insert_id) as nb_events,

    FROM  mixpanel_direct_export.mp_master_event as ev

    WHERE
        mp_event_name = 'clickProduct'
        and extract(date from time) >= date_sub(current_date(), interval 30 day)
        and not (extract(date from time) = '2024-03-27')
    GROUP BY productid
),
TRAFFIC7 as (
    SELECT
        productid,
        count(distinct mp_insert_id) as nb_events,

    FROM  mixpanel_direct_export.mp_master_event as ev

    WHERE
        mp_event_name = 'clickProduct'
        and extract(date from time) >= date_sub(current_date(), interval 7 day)
        and not (extract(date from time) = '2024-03-27')

    GROUP BY productid
),
TRAFFICTOT as (
    SELECT
        productid,
        count(distinct mp_insert_id) as nb_events,

    FROM  mixpanel_direct_export.mp_master_event as ev

    WHERE
        mp_event_name = 'clickProduct'

    GROUP BY productid
),
FAV as (
    SELECT
        count(distinct fav.id) as nb_fav,
        internalProductId

    FROM backend__public.FavoriteProducts as fav

    where fav.createdat >= date_sub(current_date(), interval 90 day)

    group by internalProductId
)

SELECT * FROM (
    SELECT
        prod.id as id,
        p.id as shopifyid,
        case when sum(TRAFFIC30.nb_events) IS NULL THEN 0 ELSE sum(TRAFFIC30.nb_events) END AS traffic30,
        case when sum(TRAFFIC7.nb_events) IS NULL THEN 0 ELSE sum(TRAFFIC7.nb_events) END AS traffic7,
        case when sum(TRAFFICTOT.nb_events) IS NULL THEN 0 ELSE sum(TRAFFICTOT.nb_events) END AS traffictot,
        case when sum(FAV.nb_fav) IS NULL THEN 0 ELSE sum(FAV.nb_fav) END AS nb_fav,

    FROM {{ref('dim_product')}} AS p
    LEFT JOIN TRAFFIC30 AS TRAFFIC30 ON TRAFFIC30.productid = cast(p.id AS string)
    LEFT JOIN TRAFFIC7 AS TRAFFIC7 ON TRAFFIC7.productid = cast(p.id AS string)
    LEFT JOIN TRAFFICTOT AS TRAFFICTOT ON TRAFFICTOT.productid = cast(p.id AS string)
    LEFT JOIN backend__dbt.store_product_for_analytics AS prod ON prod.shopify_id = p.id
    LEFT JOIN FAV AS FAV ON cast(FAV.internalProductId AS string) = cast(prod.id AS string)

    GROUP BY p.id, prod.id
    ORDER BY nb_fav DESC
)
WHERE id IS NOT NULL AND traffic30 > 0
