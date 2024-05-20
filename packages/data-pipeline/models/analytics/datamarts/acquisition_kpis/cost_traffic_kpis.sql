with cost_traffic_kpis as (

    select
        COALESCE(costs.`date` , traffic.`date`) as date,
        COALESCE(costs.utm_source, traffic.utm_source) as utm_source,
        COALESCE(costs.utm_medium, traffic.utm_medium) as utm_medium,
        COALESCE(costs.utm_campaign, traffic.utm_campaign) as utm_campaign,
        sum(costs.impressions) as impressions,
        sum(costs.clicks) as clicks,
        sum(costs.conversions) as platforms_conversions,
        sum(costs.spend) as spend,
        sum(traffic.users) as users,
        sum(traffic.bounces) as bounces,
        sum(traffic.session_duration) as session_duration,
        sum(traffic.sessions) as sessions
    from (
        select date, utm_source, utm_medium, utm_campaign, sum(sessions) sessions, sum(users) users , sum(bounces) as bounces , sum(session_duration) as session_duration
        from {{ ref('fact_traffic') }}
        group by 1,2,3,4) traffic
    full outer join (
        select date, utm_source, utm_medium, utm_campaign, REGEXP_EXTRACT(landing_page, r'barooders.com(.+)$') landing_page, channel, sum(impressions) impressions, sum(conversions) conversions, sum(spend) spend, sum(clicks) clicks 
        from {{ ref('fact_acquisition_cost') }}
        group by 1,2,3,4,5,6
        union all
        select date, 'all', 'all', 'all', 'all', 'all', sum(impressions) impressions, sum(conversions) conversions, sum(spend) spend, sum(clicks) clicks 
        from {{ ref('fact_acquisition_cost') }}
        group by 1,2,3,4,5,6
        ) costs
    on costs.date = traffic.`date`
    and costs.utm_source = traffic.utm_source
    and costs.utm_medium = traffic.utm_medium
    and costs.utm_campaign = traffic.utm_campaign
    group by 1,2,3,4

)

select *
from cost_traffic_kpis