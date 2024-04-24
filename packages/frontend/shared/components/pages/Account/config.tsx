import { AccountSections } from '@/types';
import { AiFillHeart } from 'react-icons/ai';
import { BsFillTagFill } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { HiBadgeCheck, HiBell, HiKey, HiMail } from 'react-icons/hi';
import { IoMdAnalytics } from 'react-icons/io';
import { MdOutlinePriceChange } from 'react-icons/md';
import { RiAccountCircleFill, RiQuestionnaireFill } from 'react-icons/ri';
import { OrderStatus, PriceOfferStatus } from './types';

const grayTag = 'bg-gray-100 text-gray-800';
const yellowTag = 'bg-yellow-100 text-yellow-800';
const greenTag = 'bg-green-100 text-green-800';
const redTag = 'bg-red-100 text-red-800';

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: grayTag,
  [OrderStatus.PAID]: yellowTag,
  [OrderStatus.LABELED]: yellowTag,
  [OrderStatus.SHIPPED]: greenTag,
  [OrderStatus.DELIVERED]: greenTag,
  [OrderStatus.CANCELED]: redTag,
  [OrderStatus.RETURNED]: yellowTag,
  [OrderStatus.PAID_OUT]: greenTag,
};

export const PRICE_OFFER_STATUS_COLORS: Record<PriceOfferStatus, string> = {
  [PriceOfferStatus.PROPOSED]: grayTag,
  [PriceOfferStatus.DECLINED]: redTag,
  [PriceOfferStatus.CANCELED]: grayTag,
  [PriceOfferStatus.BOUGHT_WITH]: greenTag,
  [PriceOfferStatus.ACCEPTED]: greenTag,
};

const ICON_COLOR = '#828E96';

type MenuBlockConfig = {
  slug: string;
  link?: string;
  isVisible?: (props: { isB2BUser: boolean; isProUser: boolean }) => boolean;
  icon: React.ReactNode;
};

export const MENU_BLOCKS_CONFIG: MenuBlockConfig[][] = [
  [
    {
      slug: 'chat',
      link: '/pages/chat',
      icon: (
        <HiMail
          size={20}
          color={ICON_COLOR}
        />
      ),
    },
  ],
  [
    {
      slug: 'personalInfos',
      link: '/account/info',
      icon: (
        <RiAccountCircleFill
          size={20}
          color={ICON_COLOR}
        />
      ),
    },
    {
      slug: 'priceOffers',
      link: '/account/price-offers',
      isVisible: ({ isB2BUser }) => isB2BUser,
      icon: (
        <MdOutlinePriceChange
          size={20}
          color={ICON_COLOR}
        />
      ),
    },
    {
      slug: 'vendorData',
      link: '/account/vendor-data',
      isVisible: ({ isProUser }) => isProUser,
      icon: (
        <IoMdAnalytics
          size={20}
          color={ICON_COLOR}
        />
      ),
    },
    {
      slug: 'security',
      link: '/account/reset-password',
      icon: (
        <HiKey
          size={20}
          color={ICON_COLOR}
        />
      ),
    },
    {
      slug: 'alerts',
      link: '/account/search-alerts',
      icon: (
        <HiBell
          size={20}
          color={ICON_COLOR}
        />
      ),
    },
  ],
  [
    {
      slug: 'faq',
      link: 'https://support-barooders.gorgias.help/fr-FR/articles',
      icon: (
        <RiQuestionnaireFill
          size={20}
          color={ICON_COLOR}
        />
      ),
    },
    {
      slug: 'logout',
      icon: (
        <FiLogOut
          size={20}
          color={ICON_COLOR}
        />
      ),
    },
  ],
];

export const SUPPORT_PHONE_NUMBER = '01 89 71 32 90';
export const SUPPORT_INTERNATIONAL_PHONE_NUMBER = '+33189713290';
export const MAX_PRODUCTS_PER_BLOCK = 3;

export const PRODUCTS_BY_SECTION = [
  {
    icon: (
      <AiFillHeart
        size={20}
        color={ICON_COLOR}
      />
    ),
    slug: AccountSections.FAVORITES,
  },
  {
    icon: (
      <BsFillTagFill
        size={20}
        color={ICON_COLOR}
      />
    ),
    slug: AccountSections.ONLINE_PRODUCTS,
  },
  {
    icon: (
      <FaShoppingCart
        size={20}
        color={ICON_COLOR}
      />
    ),
    slug: AccountSections.PURCHASES,
  },
  {
    icon: (
      <HiBadgeCheck
        size={20}
        color={ICON_COLOR}
      />
    ),
    slug: AccountSections.ORDERS,
  },
];
