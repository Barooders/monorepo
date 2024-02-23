import {
  Banner,
  BlockStack,
  Button,
  Form,
  InlineLayout,
  PhoneField,
  Select,
  Spinner,
  TextField,
  View,
  useCustomer,
  useEmail,
  usePhone,
  useTranslate,
} from '@shopify/ui-extensions-react/checkout';
import { Civility, PaymentSolutions } from '../constants';
import { useState } from 'react';
import useCheckEligibility, {
  CustomerInfo,
} from '../hooks/useCheckEligibility';
import { useAsyncFn } from 'react-use';
import dayjs from '../libs/dayjs';

type PropsType = {
  paymentHandle: string;
};

const initialFormState = {
  civility: Civility.MISTER,
  birthdate: '',
  birthZipcode: '',
  phone: '',
  email: '',
  firstname: '',
  lastname: '',
};

export type FormType = {
  civility: Civility;
  birthdate: string;
  birthZipcode: string;
  phone: string;
  email: string;
  firstname: string;
  lastname: string;
};

const EligibilityForm: React.FC<PropsType> = ({ paymentHandle }) => {
  const translate = useTranslate();
  const [formState, setFormState] = useState(initialFormState);
  const checkoutCustomer = useCustomer();
  const checkoutEmail = useEmail();
  const checkoutPhone = usePhone();
  const fetchEligibilityToken = useCheckEligibility();

  const updateFormValue = (key: string, value) => {
    setFormState({
      ...formState,
      [key]: value,
    });
  };

  const [submitState, doSubmit] = useAsyncFn(async () => {
    const customerEmail = checkoutEmail ?? formState.email;
    const customerPhone = checkoutPhone ?? formState.phone;

    if (!customerPhone.startsWith('+')) {
      throw new Error(translate('phoneError'));
    }

    const birthDate = dayjs(formState.birthdate, 'DD/MM/YYYY');

    if (!birthDate.isValid()) {
      throw new Error(translate('birthDateError'));
    }

    if (Number.isNaN(formState.birthZipcode)) {
      throw new Error(translate('birthZipcodeError'));
    }

    const customerInfo: CustomerInfo = {
      birthDate: birthDate.toISOString(),
      birthZipCode: formState.birthZipcode,
      phoneNumber: customerPhone.replace(/ /g, ''),
      civility: formState.civility,
      email: customerEmail,
      firstName: checkoutCustomer?.firstName ?? formState.firstname,
      lastName: checkoutCustomer?.lastName ?? formState.lastname,
    };

    if (Object.values(customerInfo).some((info) => !info)) {
      throw new Error(translate('formError'));
    }

    try {
      await fetchEligibilityToken(customerInfo, paymentHandle);
    } catch (e) {
      console.error(e);
    } finally {
      // Display error anyway as the form should be unmounted when the Promise is over
      throw Error(translate('anyError'));
    }
  }, [formState]);

  return (
    <Form onSubmit={doSubmit}>
      <BlockStack spacing="base">
        {submitState.error && (
          <Banner status="critical">{submitState.error.message}</Banner>
        )}
        <View>{translate('neededInformation')}</View>
        <Select
          label={translate('civility')}
          options={[
            { value: Civility.MISTER, label: translate('mister') },
            { value: Civility.MISS, label: translate('miss') },
          ]}
          onChange={(value: Civility) => updateFormValue('civility', value)}
          value={formState.civility}
        />
        {!checkoutCustomer && (
          <InlineLayout spacing="base">
            <TextField
              label={translate('firstname')}
              value={formState.firstname}
              onChange={(value) => updateFormValue('firstname', value)}
            />
            <TextField
              label={translate('lastname')}
              value={formState.lastname}
              onChange={(value) => updateFormValue('lastname', value)}
            />
          </InlineLayout>
        )}
        <InlineLayout spacing="base">
          <TextField
            label={translate('birthdate')}
            onChange={(value) => updateFormValue('birthdate', value)}
            value={formState.birthdate}
          />
          <TextField
            label={translate('birthZipcode')}
            onChange={(value) => updateFormValue('birthZipcode', value)}
            value={formState.birthZipcode}
          />
        </InlineLayout>
        <InlineLayout spacing="base">
          {!checkoutPhone && (
            <PhoneField
              label={translate('phoneNumber')}
              onChange={(value) => updateFormValue('phone', value)}
            />
          )}
          {!checkoutEmail && (
            <TextField
              label={translate('email')}
              value={formState.email}
              onChange={(value) => updateFormValue('email', value)}
            />
          )}
        </InlineLayout>
        <Button
          kind="primary"
          accessibilityRole="submit"
        >
          {submitState.loading ? (
            <Spinner appearance="monochrome" />
          ) : (
            translate('checkEligibility')
          )}
        </Button>
      </BlockStack>
    </Form>
  );
};

export default EligibilityForm;
