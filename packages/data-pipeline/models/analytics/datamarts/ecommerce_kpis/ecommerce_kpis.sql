{{ config(materialized='table') }}

WITH ecommerce_kpis AS (

  SELECT
    date,
    owner,
    sum(CASE WHEN indicator_name = 'gmv' THEN indicator_value END) AS gmv,
    sum(CASE WHEN indicator_name = 'buyer_commission' THEN indicator_value END) AS buyer_commission,
    sum(CASE WHEN indicator_name = 'paid_gmv' THEN indicator_value END) AS paid_gmv,
    sum(CASE WHEN indicator_name = 'paid_buyer_commission' THEN indicator_value END) AS paid_buyer_commission,
    coalesce(sum(CASE WHEN indicator_name = 'gross_sales' THEN indicator_value END), 0)
    - coalesce(sum(CASE WHEN indicator_name = 'discounts' THEN indicator_value END), 0)
    - coalesce(sum(CASE WHEN indicator_name = 'refunds' THEN indicator_value END), 0)
    + coalesce(sum(CASE WHEN indicator_name = 'shipping_fees' THEN indicator_value END), 0) AS net_gmv,
    coalesce(sum(CASE WHEN indicator_name = 'gross_sales_paid' THEN indicator_value END), 0)
    - coalesce(sum(CASE WHEN indicator_name = 'discounts' THEN indicator_value END), 0)
    - coalesce(sum(CASE WHEN indicator_name = 'refunds' THEN indicator_value END), 0)
    + coalesce(sum(CASE WHEN indicator_name = 'shipping_fees_paid' THEN indicator_value END), 0) AS net_gmv_paid,
    sum(CASE WHEN indicator_name = 'buyers' THEN indicator_value END) AS buyers,
    sum(CASE WHEN indicator_name = 'orders' THEN indicator_value END) AS orders,
    sum(CASE WHEN indicator_name = 'paid_orders' THEN indicator_value END) AS paid_orders,
    sum(CASE WHEN indicator_name = 'sessions' THEN indicator_value END) AS sessions,
    sum(CASE WHEN indicator_name = 'users' THEN indicator_value END) AS users,
    sum(CASE WHEN indicator_name = 'new_buyers' THEN indicator_value END) AS new_buyers,
    sum(CASE WHEN indicator_name = 'shipping_fees' THEN indicator_value END) AS shipping_fees,
    sum(CASE WHEN indicator_name = 'subscribers' THEN indicator_value END) AS subscribers,
    sum(CASE WHEN indicator_name = 'submitted_products' THEN indicator_value END) AS submitted_products,
    sum(CASE WHEN indicator_name = 'new_vendors' THEN indicator_value END) AS new_vendors,
    sum(CASE WHEN indicator_name = 'active_vendors' THEN indicator_value END) AS active_vendors,
    sum(CASE WHEN indicator_name = 'returners' THEN indicator_value END) AS returners,
    sum(CASE WHEN indicator_name = 'refunds' THEN indicator_value END) AS refunds,
    sum(CASE WHEN indicator_name = 'discounts' THEN indicator_value END) AS discounts,
    sum(CASE WHEN indicator_name = 'gross_sales' THEN indicator_value END) AS gross_sales,
    sum(CASE WHEN indicator_name = 'bike_gmv' THEN indicator_value END) AS bike_gmv


  FROM
    {{ ref('ecommerce_unioned_kpis') }}

  GROUP BY date, owner

)

SELECT *
FROM ecommerce_kpis
