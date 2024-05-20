{{ config(materialized='table') }}

with acquisition_kpis as (

    select
        COALESCE(k.`date` , o.`date`) as date,
        COALESCE(k.utm_source, o.utm_source) as utm_source,
        COALESCE(k.utm_medium, o.utm_medium) as utm_medium,
        COALESCE(k.utm_campaign, o.utm_campaign) as utm_campaign,
        sum(k.impressions) as impressions,
        sum(k.clicks) as clicks,
        sum(k.platforms_conversions) as platforms_conversions,
        sum(k.spend) as spend,
        sum(k.sessions) as sessions,
        sum(k.users) as users,
        sum(k.bounces) as bounces,
        sum(k.session_duration) as session_duration,
        sum(o.count_orders) as shopify_conversions,
        sum(o.count_paid_orders) as shopify_paid_conversions,
        sum(o.gmv) as gmv,
        sum(o.paid_gmv) paid_gmv
    from {{ref('cost_traffic_kpis')}} k
    full outer join (
        select cast(date_trunc(creation_date, day) as date) as date,
        utm_source,
        utm_medium,
        utm_campaign,
        sum(total_price) gmv,
        sum(case when financial_status != 'pending' then total_price else null end) paid_gmv,
        count(distinct order_id) count_orders,
        count(distinct case when financial_status != 'pending' then order_id else null end) count_paid_orders,
        from dbt.fact_order_line
        group by 1,2,3,4

        union all

        select
            cast(date_trunc(creation_date, day) as date) as date,
            'all',
            'all',
            'all',
            sum(total_price) gmv,
            sum(case when financial_status != 'pending' then total_price else null end) paid_gmv,
            count(distinct order_id) count_orders,
            count(distinct case when financial_status != 'pending' then order_id else null end) count_paid_orders,
        from dbt.fact_order_line
        group by 1,2,3,4
        ) o
    on k.date = o.`date`
    and k.utm_source = o.utm_source
    and k.utm_medium = o.utm_medium
    and k.utm_campaign = o.utm_campaign
    group by 1,2,3,4
)

select *
from acquisition_kpis
order by date desc
