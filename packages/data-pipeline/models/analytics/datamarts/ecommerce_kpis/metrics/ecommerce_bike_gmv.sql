WITH ecommerce_bike_gmv AS (

  SELECT
    o.owner,
    'bike_gmv' AS indicator_name,
    date_trunc(o.creation_date, DAY) AS date,
    sum(o.total_price) AS indicator_value
  FROM {{ ref('fact_order_line') }} AS o
  INNER JOIN {{ ref('dim_product') }} AS p ON o.product_id = p.id
  WHERE
    p.product_type IN (
      'VTT',
      'Vélos de course',
      'Vélos de triathlon',
      'Gravel',
      'BMX',
      'VTT électriques',
      'Vélos de route',
      'Vélos de route électriques',
      'Vélos de contre la montre',
      'Cyclocross',
      'Gravel électriques',
      'Vélos de trekking',
      'VTC électriques',
      'Vélos de ville électriques',
      'Vélos enfant',
      'Vélos de ville',
      'VTC',
      'Vélos vintage',
      'Vélos urbains et hollandais',
      'Vélos pliants',
      'Vélos longtail',
      'Vélos cargo',
      'Fixie et singlespeed'
    )
  GROUP BY date, o.owner, indicator_name

)

SELECT *
FROM ecommerce_bike_gmv
