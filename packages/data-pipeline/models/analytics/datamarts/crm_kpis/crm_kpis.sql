{{ config(materialized='table') }}

with crm_kpis as (

    select 
        campaign_name,
        sent_date,
        sum(case when indicator_name = 'Opened Email' then indicator_value end) as unique_openers,
        sum(case when indicator_name = 'Bounced Email' then indicator_value end) as bounced_emails,
        sum(case when indicator_name = 'Received Email' then indicator_value end) as received_emails,
        sum(case when indicator_name = 'Bounced Email' or indicator_name = 'Received Email' then indicator_value end) as recipients,
        sum(case when indicator_name = 'Clicked Email' then indicator_value end) as unique_clickers,
        sum(case when indicator_name = 'Unsubscribed' then indicator_value end) as unsubscribers

    from 
        {{ref('crm_indicators')}}

    group by 1,2

)

select *
from crm_kpis