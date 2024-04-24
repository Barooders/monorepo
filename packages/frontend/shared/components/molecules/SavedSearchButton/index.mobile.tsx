import PortalDrawer from '@/components/atoms/Drawer/portal';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import { FaRegBell } from 'react-icons/fa';
import SavedSearchForm from './SavedSearchForm';

const dict = getDictionary('fr');

const SavedSearchButton: React.FC = () => {
  const { needsLogin } = useIsLoggedIn();

  return (
    <PortalDrawer
      ButtonComponent={({ openMenu }) => (
        <button
          onClick={needsLogin(openMenu)}
          className="rounded-full bg-primary-600 p-3 text-sm font-medium text-white"
        >
          <div className="flex items-center gap-2">
            <FaRegBell className="text-white" />
            {dict.searchAlerts.buttonLabel}
          </div>
        </button>
      )}
      ContentComponent={({ closeMenu }) => (
        <SavedSearchForm
          onSave={closeMenu}
          onClose={closeMenu}
        />
      )}
    />
  );
};

export default SavedSearchButton;
