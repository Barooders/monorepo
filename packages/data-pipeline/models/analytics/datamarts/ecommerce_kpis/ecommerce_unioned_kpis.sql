WITH ecommerce_unioned_kpis AS (

  SELECT * FROM {{ ref('ecommerce_gmv') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_buyer_commission') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_paid_gmv') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_paid_buyer_commission') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_buyers') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_orders') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_paid_orders') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_sessions') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_users') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_new_buyers') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_shipping_fees') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_subscribers') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_submitted_products') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_active_vendors') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_new_vendors') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_returners') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_refunds') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_discounts') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_gross_sales') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_gross_sales_paid') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_shipping_fees_paid') }}
  UNION ALL
  SELECT * FROM {{ ref('ecommerce_bike_gmv') }}

)

SELECT *
FROM ecommerce_unioned_kpis
