{{ config(materialized='table') }}

with fact_acquisition_cost as (
    -- Historic data before 04/2024 (source Fivetran)
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
		WHERE date <= '2024-04-01'
    group by 1,2,3,4,5,6,7,8,9

    union all

    -- New data after 04/2024 (source Google Ads transfer)
    select
        ad_stats.segments_date as date,
        'google' as utm_source,
        'cpc' as utm_medium,
        campaign.campaign_name as utm_campaign,
        'Paid Search' as channel,
        ad_group.ad_group_name,
        cast(null as STRING) as ad_name,
        REGEXP_EXTRACT(ad.ad_group_ad_ad_final_app_urls, r'\[(.+)\]') as landing_page,
        'Google Ads' as platform,
        sum(ad_stats.metrics_clicks) as clicks,
        sum(ad_stats.metrics_impressions) as impressions,
        sum(ad_stats.metrics_cost_micros) / 1000000 as spend,
        sum(ad_stats.metrics_conversions) as conversions
    FROM ads_direct_export.ads_Ad_5663401656 as ad
		LEFT JOIN ads_direct_export.ads_AdBasicStats_5663401656 as ad_stats ON ad.ad_group_ad_ad_id = ad_stats.ad_group_ad_ad_id
		LEFT JOIN ads_direct_export.ads_AdGroup_5663401656 as ad_group ON ad_group.ad_group_id = ad.ad_group_id AND ad_group._DATA_DATE = ad_group._LATEST_DATE
		LEFT JOIN ads_direct_export.ads_Campaign_5663401656 as campaign ON campaign.campaign_id = ad.campaign_id AND campaign._DATA_DATE = campaign._LATEST_DATE
		WHERE ad_stats.segments_date >= '2024-04-01'
			AND ad._DATA_DATE = ad._LATEST_DATE
    group by date, campaign.campaign_name, ad_group.ad_group_name, ad.ad_group_ad_ad_final_app_urls

    union all

    select
        a.`date`,
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

