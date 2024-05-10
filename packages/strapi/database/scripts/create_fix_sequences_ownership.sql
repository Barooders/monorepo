---
---  Found in https://wiki.postgresql.org/wiki/Fixing_Sequences
---  Fixed with https://stackoverflow.com/a/58798028
---

select 'ALTER SEQUENCE '|| quote_ident(min(schema_name)) ||'.'|| quote_ident(min(seq_name))
       ||' OWNED BY '|| quote_ident(min(table_name)) ||'.'|| quote_ident(min(column_name)) ||';'
from (
    select 
        n.nspname as schema_name,
        c.relname as table_name,
        a.attname as column_name,
        substring(pg_get_expr(d.adbin, d.adrelid) from E'^nextval\\(''([^'']*)''(?:::text|::regclass)?\\)') as seq_name 
    from pg_class c 
    join pg_attribute a on (c.oid=a.attrelid) 
    join pg_attrdef d on (a.attrelid=d.adrelid and a.attnum=d.adnum) 
    join pg_namespace n on (c.relnamespace=n.oid)
    where has_schema_privilege(n.oid,'USAGE')
      and n.nspname not like 'pg!_%' escape '!'
      and has_table_privilege(c.oid,'SELECT')
      and (not a.attisdropped)
      and pg_get_expr(d.adbin, d.adrelid) ~ '^nextval'
) seq
group by seq_name having count(*)=1;
