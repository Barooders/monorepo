import CreatePage from '@/components/pages/SellingForm/CreatePage';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

export const metadata = {
  title: dict.sellingForm.createMainTitle,
};

const SellFormProductTypeSearch = () => <CreatePage />;

export default SellFormProductTypeSearch;
