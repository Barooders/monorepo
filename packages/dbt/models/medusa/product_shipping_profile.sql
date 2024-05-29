{{ config(schema='medusa', materialized='table') }}

SELECT
  product.id AS product_id,
  COALESCE(vendor_profile.id, general_profile.id) AS profile_id
FROM medusa.product
LEFT JOIN medusa.store AS vendor ON product.store_id = vendor.id
LEFT JOIN medusa.shipping_profile AS vendor_profile
  ON EXISTS (
    SELECT 1
    FROM JSONB_ARRAY_ELEMENTS_TEXT(vendor_profile.metadata -> 'vendorNames')
    WHERE vendor.name = value
  )
LEFT JOIN medusa.shipping_profile AS general_profile ON general_profile.type = 'default'
