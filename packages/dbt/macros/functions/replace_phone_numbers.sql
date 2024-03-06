{% macro create_f_replace_phone_numbers() %}
CREATE OR REPLACE FUNCTION REPLACE_PHONE_NUMBER(value varchar) RETURNS varchar AS $$
        BEGIN
            RETURN REGEXP_REPLACE(value, '(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}', '***', 1, 0);
        END;
$$ LANGUAGE plpgsql;
{% endmacro %}
