CREATE OR REPLACE FUNCTION public.favorite_product_graphql_id(favoriteProducts "FavoriteProducts")
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
  RETURN (SELECT 'gid://shopify/Product/' || favoriteProducts."productId");
END;
$function$
