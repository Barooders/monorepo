'use client';

import { FetchNegociationAgreementQuery } from '@/__generated/graphql';
import Loader from '@/components/atoms/Loader';
import useUser from '@/hooks/state/useUser';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { gql } from '@apollo/client';
import first from 'lodash/first';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import PersonalInfoForm from '.';

const GET_VENDOR_NEGOCIATION_AGREEMENT = gql`
  query fetchNegociationAgreement($vendorId: uuid) {
    NegociationAgreement(where: { vendorId: { _eq: $vendorId } }) {
      id
      maxAmountPercent
    }
    Customer(where: { authUserId: { _eq: $vendorId } }) {
      user {
        phoneNumber
      }
    }
  }
`;

type PropsType = {
  onSuccess?: () => void;
};

const WrappedPersonalInfoForm: React.FC<PropsType> = (props) => {
  const fetchVendorNegoAgreement = useHasura<FetchNegociationAgreementQuery>(
    GET_VENDOR_NEGOCIATION_AGREEMENT,
    HASURA_ROLES.ME_AS_VENDOR,
  );
  const { hasuraToken } = useUser();

  const [initState, doFetch] = useWrappedAsyncFn(fetchVendorNegoAgreement);

  useEffect(() => {
    doFetch({ vendorId: hasuraToken?.user.id });
  }, []);

  const negociationAgreement = first(initState.value?.NegociationAgreement);
  const openToNegociation = !!negociationAgreement?.id;
  const phoneNumber = first(initState.value?.Customer)?.user?.phoneNumber;

  return !initState.value || initState.loading ? (
    <Loader />
  ) : (
    <PersonalInfoForm
      {...props}
      agreementId={negociationAgreement?.id}
      maxAmountPercent={negociationAgreement?.maxAmountPercent}
      openToNegociation={openToNegociation}
      phoneNumber={phoneNumber ?? undefined}
    />
  );
};

export default WrappedPersonalInfoForm;
