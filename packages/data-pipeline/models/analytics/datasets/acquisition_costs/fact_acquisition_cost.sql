{{ config(materialized='table') }}

with fact_acquisition_cost as (

    select 
        a.`date` as date,
        'google' as utm_source,
        'cpc' as utm_medium,
        a.campaign_name as utm_campaign,
        'Paid Search' as channel,
        a.ad_group_name,
        ad_name,
        REGEXP_EXTRACT(a.ad_final_urls, r'\[(.+)\]') as landing_page,
        'Google Ads' as platform,
        sum(a.clicks) as clicks,
        sum(a.impressions) as impressions,
        sum(a.cost_micros)/1000000 as spend,
        sum(a.conversions) as conversions
    from google_ads.google_ads_report  a 
    group by 1,2,3,4,5,6,7,8,9

    union all

    select 
        c.`date` as date,
        'google' as utm_source,
        'cpc' as utm_medium,
        c.name as utm_campaign,
        'Paid Search' as channel,
        cast(null as STRING) as ad_group_name,
        cast(null as STRING) as ad_name,
        cast(null as STRING) as landing_page,
        'Google Ads' as platform,
        sum(c.clicks) as clicks,
        sum(c.impressions) as impressions,
        sum(c.cost_micros)/1000000 as spend,
        sum(c.conversions) as conversions
    from google_ads.google_ads_campaign  c
    left join google_ads.google_ads_report a on a.campaign_name = c.name
    where a.campaign_name is null
    group by 1,2,3,4,5,6,7,8,9

    union all

    select 
        a.`date` ,
        'facebook' as utm_source,
        'cpc' as utm_medium,
        a.campaign_name as utm_campaign,
        'Paid Search' as channel,
        a.adset_name ,
        a.ad_name ,
        cast(null as STRING) as landing_page,
        'Facebook Ads' as platform,
        sum(a.clicks) as clicks,
        sum(a.impressions) as impressions ,
        sum(a.spend) as spend ,
        COALESCE (sum(conv.value), 0) as conversions
    from facebook_ads.facebook_ads_ads a 
    left join (select ad_id, date, sum(value) value from facebook_ads.facebook_ads_ads_conversions group by 1,2) conv on conv.ad_id = a.ad_id 
    and conv.`date` = a.`date`
    where account_id = 316479733259152
    group by 1,2,3,4,5,6,7,8,9

)

select *
from fact_acquisition_cost
order by 1 desc

