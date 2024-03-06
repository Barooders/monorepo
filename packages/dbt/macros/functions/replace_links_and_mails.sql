{% macro create_f_replace_links_and_mails() %}
CREATE OR REPLACE FUNCTION REPLACE_LINKS_AND_MAILS(value varchar) RETURNS varchar AS $$
        BEGIN
            RETURN REGEXP_REPLACE(
                REGEXP_REPLACE(value, '<a.*?>.*?</a>', '***', 1, 0),
                '(https?://)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,255}\.[a-zA-Z()]{1,6}([-a-zA-Z0-9()!@:%_+.~#?&/=]*)',
                '***',
                1,
                0
           );
        END;
$$ LANGUAGE plpgsql;
{% endmacro %}
