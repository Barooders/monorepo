with crm_indicators as (
    select c.id , c.name campaign_name , m.name indicator_name, sent_date.sent_date, count(distinct e.person_id) indicator_value
    from klaviyo.event e
    left join klaviyo.campaign c on c.id = e.campaign_id 
    left join klaviyo.metric m on m.id = e.metric_id 
    left join (select e.campaign_id , min(e.`datetime`) as sent_date from klaviyo.event e group by 1) sent_date on sent_date.campaign_id = e.campaign_id 
    where m.id in ('RqePhG','Un5xG3','Wavrcw','XxM2Y3','VKm9ty','TWVfX5')
    group by 1,2,3,4
    order by 1 asc
) 


select *
from crm_indicators