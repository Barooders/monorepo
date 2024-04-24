import useUpdateSavedSearch from '@/hooks/useUpdateSavedSearch';
import { useState } from 'react';
import { IoMdNotifications, IoMdNotificationsOff } from 'react-icons/io';
import Button from '../../atoms/Button';

const SearchAlertToggleButton: React.FC<{
  searchId: string;
  isSearchAlertInitiallyActive: boolean;
}> = ({ searchId, isSearchAlertInitiallyActive }) => {
  const [, updateSavedSearch] = useUpdateSavedSearch();
  const [isSearchAlertActive, setIsSearchAlertActive] = useState<boolean>(
    isSearchAlertInitiallyActive,
  );

  const toggleSearchAlert = async () => {
    const shouldTriggerAlerts = !isSearchAlertActive;

    await updateSavedSearch(searchId, {
      shouldTriggerAlerts,
    });
    setIsSearchAlertActive(shouldTriggerAlerts);
  };

  return (
    <Button
      onClick={toggleSearchAlert}
      intent={isSearchAlertActive ? 'primary' : 'discrete'}
      className="text-md w-full shadow-md"
    >
      <div className="flex items-center justify-center gap-2">
        {isSearchAlertActive ? (
          <IoMdNotifications className="text-white" />
        ) : (
          <IoMdNotificationsOff className="text-black" />
        )}
      </div>
    </Button>
  );
};

export default SearchAlertToggleButton;
