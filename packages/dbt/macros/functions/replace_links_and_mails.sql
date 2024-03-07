{% macro create_f_replace_links_and_mails() %}
CREATE OR REPLACE FUNCTION REPLACE_LINKS_AND_MAILS(value varchar) RETURNS varchar AS $$
        BEGIN
            RETURN REGEXP_REPLACE(
                REGEXP_REPLACE(value, '<a.*?>.*?</a>', '***', 'g'),
                '(https?://)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,255}\.(fr|com)([-a-zA-Z0-9()!@:%_+.~#?&/=]*)',
                '***',
                'g'
           );
        END;
$$ LANGUAGE plpgsql;
{% endmacro %}
