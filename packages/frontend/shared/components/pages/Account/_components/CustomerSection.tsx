import Link from '@/components/atoms/Link';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type AccountCustomerSectionProps = {
  customer:
    | {
        firstName: string | null;
        sellerName: string | null;
        profilePictureShopifyCdnUrl: string | null;
        createdAt: string;
      }
    | undefined;
};

const AccountCustomerSection = ({ customer }: AccountCustomerSectionProps) => {
  return (
    <div className="flex flex-row rounded-lg border border-zinc-200 py-4 pl-4 pr-8">
      <div className="h-[80px] w-[80px] rounded-full bg-gray-200">
        <img
          src={
            customer?.profilePictureShopifyCdnUrl ??
            'https://cdn.shopify.com/s/files/1/0576/4340/1365/files/incognito.png?width=80&height=80'
          }
          className="rounded-full object-cover"
          alt="Profile picture"
        />
      </div>
      <div className="ml-5 flex grow flex-col items-start justify-between sm:flex-row sm:items-center">
        <div className="grow">
          <div>
            {customer?.firstName && (
              <span className="text-xl font-bold text-gray-800">
                {customer.firstName}
              </span>
            )}
            {customer?.sellerName && (
              <span className="ml-2">@{customer.sellerName}</span>
            )}
          </div>
          {customer?.createdAt && (
            <p className="mt-1 text-gray-600">
              {dict.account.signedSinceThe}{' '}
              {new Date(customer.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>
        {customer?.sellerName && (
          <Link
            href={`https://barooders.com/collections/vendors?q=${encodeURIComponent(
              customer.sellerName,
            )}`}
            className="rounded-lg bg-gray-100 px-3 py-2.5 text-sm font-semibold uppercase"
          >
            {dict.account.seeMyShop}
          </Link>
        )}
      </div>
    </div>
  );
};

export default AccountCustomerSection;
