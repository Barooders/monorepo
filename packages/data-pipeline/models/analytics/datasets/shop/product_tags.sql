with product_tags as (
    select t.product_id, split(t.value, ':')[OFFSET(0)] tag, t.value as full_tag, min(split(t.value, ':')[OFFSET(1)]) value
    from shopify.product_tag t
    WHERE REGEXP_CONTAINS(value, ':')
    group by 1,2,3
)

select *
from product_tags