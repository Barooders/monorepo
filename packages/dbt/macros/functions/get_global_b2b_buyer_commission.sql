{% macro create_f_get_global_b2b_buyer_commission_multiplier() %}
    CREATE OR REPLACE FUNCTION GET_GLOBAL_B2B_BUYER_COMMISSION_MULTIPLIER ()
        RETURNS numeric
        AS $$
    DECLARE
        commission_value numeric;
    BEGIN
        SELECT
            (1 + ((rules ->> 0)::jsonb ->> 'value')::numeric /100) INTO commission_value
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
