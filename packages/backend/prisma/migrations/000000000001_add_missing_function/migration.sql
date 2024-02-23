CREATE OR REPLACE FUNCTION public.shopify_search(customer "Customer")
 RETURNS text
 LANGUAGE plpgsql
 STABLE
AS $function$
BEGIN
  RETURN (SELECT 'vendor:''' || customer."sellerName" || ''' OR vendor:' || customer."shopifyId");
END;
$function$
