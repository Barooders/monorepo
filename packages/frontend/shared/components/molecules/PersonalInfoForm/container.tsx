'use client';

import PersonalInfoForm from '.';
import { HASURA_ROLES } from '@/config';
import useUser from '@/hooks/state/useUser';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { FetchNegociationAgreementQuery } from '@/__generated/graphql';
import { gql } from '@apollo/client';
import first from 'lodash/first';
import { useEffect } from 'react';
import Loader from '@/components/atoms/Loader';

const GET_VENDOR_NEGOCIATION_AGREEMENT = gql`
  query fetchNegociationAgreement($vendorId: uuid) {
    NegociationAgreement(where: { vendorId: { _eq: $vendorId } }) {
      id
      maxAmountPercent
    }
  }
`;

type PropsType = {
  onSuccess?: () => void;
};

const WrappedPersonalInfoForm: React.FC<PropsType> = (props) => {
  const fetchVendorNegoAgreement = useHasura<FetchNegociationAgreementQuery>(
    GET_VENDOR_NEGOCIATION_AGREEMENT,
    HASURA_ROLES.REGISTERED_USER,
  );
  const { hasuraToken } = useUser();

  const [initState, doFetch] = useWrappedAsyncFn(fetchVendorNegoAgreement);

  useEffect(() => {
    doFetch({ vendorId: hasuraToken?.user.id });
  }, []);

  const negociationAgreement = first(initState.value?.NegociationAgreement);
  const openToNegociation = !!negociationAgreement?.id;

  return !initState.value || initState.loading ? (
    <Loader />
  ) : (
    <PersonalInfoForm
      {...props}
      agreementId={negociationAgreement?.id}
      maxAmountPercent={negociationAgreement?.maxAmountPercent}
      openToNegociation={openToNegociation}
      phoneNumber={hasuraToken?.user.phoneNumber ?? undefined}
    />
  );
};

export default WrappedPersonalInfoForm;
