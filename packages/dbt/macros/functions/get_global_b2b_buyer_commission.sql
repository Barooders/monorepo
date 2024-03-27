{% macro create_f_get_global_b2b_buyer_commission() %}
    CREATE OR REPLACE FUNCTION GET_GLOBAL_B2B_BUYER_COMMISSION ()
        RETURNS numeric
        AS $$
    DECLARE
        commission_value numeric;
    BEGIN
        SELECT
            ((rules ->> 0)::jsonb ->> 'value')::numeric INTO commission_value
        FROM
            public. "CommissionRule"
        WHERE
            TYPE = 'GLOBAL_B2B_BUYER_COMMISSION'
            AND(rules ->> 0)::jsonb ->> 'type' = 'PERCENTAGE';
        RETURN commission_value;
    END;
    $$
    LANGUAGE plpgsql;
{% endmacro %}
