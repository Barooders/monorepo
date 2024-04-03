import ContactCard from '@/components/atoms/ContactCard';
import Link from '@/components/atoms/Link';
import { useAuth } from '@/hooks/useAuth';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { CurrencyCode } from '@/types';
import { useEffect } from 'react';
import { ImPhone } from 'react-icons/im';
import {
  MENU_BLOCKS_CONFIG,
  PRODUCTS_BY_SECTION,
  SUPPORT_INTERNATIONAL_PHONE_NUMBER,
  SUPPORT_PHONE_NUMBER,
} from '../config';

interface Wallet {
  balance: {
    amountInCents: number;
    currency: CurrencyCode;
  };
  links: {
    onboardingLink?: string;
    accountLoginLink?: string;
  };
}

type PropsType = {
  vendorIsPro: boolean;
};

const AccountMenu: React.FC<PropsType> = ({ vendorIsPro }) => {
  const { logout } = useAuth();
  const { fetchAPI } = useBackend();
  const dict = getDictionary('fr');
  const [{ value }, fetchWallet] = useWrappedAsyncFn(() =>
    fetchAPI<Wallet>(`/v1/customers/wallet`),
  );

  useEffect(() => {
    fetchWallet();
  }, []);

  return (
    <>
      <div className="h-[100px]">
        {value?.links.accountLoginLink ? (
          <Link href={value.links.accountLoginLink}>
            <div className="relative h-full overflow-hidden rounded-lg bg-red-100 p-4">
              <p className="mb-2 text-3xl font-bold">
                {(value.balance.amountInCents / 100).toFixed(2)}{' '}
                {value.balance.currency.toLowerCase() === 'eur' && '€'}
              </p>
              <span className="text-slate-500">
                {dict.account.walletBalance}
              </span>
              <img
                src="/wallet.png"
                className="absolute -right-10 top-0.5 h-[90px]"
                alt="wallet"
              />
            </div>
          </Link>
        ) : value?.links.onboardingLink ? (
          <div className="h-full rounded-lg bg-gray-100 p-4">
            <p className="mb-2 text-3xl font-bold">0,00 €</p>
            <Link
              className="text-gray-600 underline"
              href={value.links.onboardingLink}
            >
              {dict.account.connectMyWallet}
            </Link>
          </div>
        ) : (
          <div className="h-full rounded-lg bg-gray-100 p-4">
            <p className="mb-2 text-3xl font-bold">0,00 €</p>
          </div>
        )}
      </div>
      <div className="mt-5 lg:hidden">
        {PRODUCTS_BY_SECTION.map((section) => (
          <Link
            className="mt-2 flex flex-row items-center rounded-lg border border-zinc-200 p-4"
            key={section.slug}
            href={dict.account.sections[section.slug].action.link}
          >
            {section.icon}
            <p className="ml-4 font-semibold text-gray-800">
              {dict.account.sections[section.slug].label}
            </p>
          </Link>
        ))}
      </div>
      {MENU_BLOCKS_CONFIG.map((block, index) => (
        <div
          className="mt-5"
          key={index}
        >
          {block.map(({ link, slug, icon, showToProVendorsOnly }) =>
            slug === 'logout' ? (
              <button
                className="mt-2 flex w-full flex-row items-center rounded-lg border border-zinc-200 p-4"
                key={slug}
                onClick={logout}
              >
                {icon}
                <p className="ml-4 font-semibold text-gray-800">
                  {dict.account.menuBlocks.logout.title}
                </p>
              </button>
            ) : !showToProVendorsOnly || vendorIsPro ? (
              <Link
                className="mt-2 flex w-full flex-row items-center rounded-lg border border-zinc-200 p-4"
                key={slug}
                href={link ?? '#'}
              >
                {icon}
                <p className="ml-4 font-semibold text-gray-800">
                  {dict.account.menuBlocks[
                    slug as keyof typeof dict.account.menuBlocks
                  ]?.title ?? ''}
                </p>
              </Link>
            ) : (
              <></>
            ),
          )}
        </div>
      ))}
      <ContactCard
        title="Célestin"
        subtitle={dict.account.support}
        imageSrc="https://cdn.shopify.com/s/files/1/0576/4340/1365/files/expert_velo_x56.jpg"
        className="mt-2"
      >
        <Link
          href="mailto:support@barooders.com"
          className="mt-2 w-full rounded-lg bg-gray-100 px-3 py-2.5 text-center font-semibold uppercase sm:mt-6"
        >
          {dict.account.sendMessageToSupport}
        </Link>
        <Link
          href={`tel:${SUPPORT_INTERNATIONAL_PHONE_NUMBER}`}
          className="mt-1 flex w-full flex-row justify-center rounded-lg bg-black px-3 py-2.5 font-semibold uppercase text-white sm:mt-2"
        >
          <ImPhone
            size={20}
            color="#FFFFFF"
          />
          <span className="ml-2">{SUPPORT_PHONE_NUMBER}</span>
        </Link>
      </ContactCard>
    </>
  );
};

export default AccountMenu;
