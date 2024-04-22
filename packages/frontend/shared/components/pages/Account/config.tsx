import { AccountSections } from '@/types';
import { AiFillHeart } from 'react-icons/ai';
import { BsFillTagFill } from 'react-icons/bs';
import { FaShoppingCart } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { HiBadgeCheck, HiBell, HiKey, HiMail } from 'react-icons/hi';
import { IoMdAnalytics } from 'react-icons/io';
import { RiAccountCircleFill, RiQuestionnaireFill } from 'react-icons/ri';
import { OrderStatus } from './types';
import { MdOutlinePriceChange } from 'react-icons/md';

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.CREATED]: 'bg-gray-100 text-gray-800',
  [OrderStatus.PAID]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.LABELED]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.SHIPPED]: 'bg-green-100 text-green-800',
  [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
  [OrderStatus.CANCELED]: 'bg-red-100 text-red-800',
  [OrderStatus.RETURNED]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.PAID_OUT]: 'bg-green-100 text-green-800',
};

const ICON_COLOR = '#828E96';

type MenuBlockConfig = {
  slug: string;
  link?: string;
  showToProVendorsOnly?: boolean;
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
      showToProVendorsOnly: true,
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
