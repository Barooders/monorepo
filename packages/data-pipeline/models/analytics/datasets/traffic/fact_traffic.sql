{{ config(materialized='table') }}

with all_traffic as (
  select
    extract(date from c.time) as date,
    'all' as utm_source,
    'all' as utm_medium,
    'all' as utm_campaign,
    null as landing_page,
    null as channel,
    null as sessions,
    count(distinct c.mp_device_id) as users,
    null as bounces,
    null as session_duration
  from mixpanel_direct_export.mp_master_event c 
  group by date, utm_source, utm_medium, utm_campaign, landing_page, channel
),
traffic as (
  select 
    extract(date from c.time) as date,
    c.utm_source as utm_source,
    c.utm_medium as utm_medium,
    c.utm_campaign as utm_campaign,
    null as landing_page,
    null as channel,
    null as sessions ,
    count(distinct c.mp_device_id) as users,
    null as bounces ,
    null as session_duration
from mixpanel_direct_export.mp_master_event c 
group by date, utm_source, utm_medium, utm_campaign, landing_page, channel
)

select * from traffic
union all
select * from all_traffic
order by date desc