import { useEffect, useState } from 'react';
import { App } from '@capacitor/app';

const useUpdateApp = (): { isVisible: boolean; news: { value: string }[] } => {
  const [isVisible, setisVisible] = useState<boolean>(false);
  const [news, setNews] = useState<{ value: string }[]>([]);

  const checkIfAppOutdated = async () => {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/mandatory-versions?nested&sort=version:DESC&populate=news`,
    );

    const resultJson = await result.json();

    const attributes = resultJson?.data?.[0]?.attributes;

    if (attributes?.version) {
      const lastMandatoryVersion = attributes.version;
      const { version: currentAppVersion } = await App.getInfo();

      const isCurrentVersionLowerThanMandatory =
        currentAppVersion.localeCompare(lastMandatoryVersion, undefined, {
          numeric: true,
          sensitivity: 'base',
        }) < 0;

      if (isCurrentVersionLowerThanMandatory) {
        setNews(attributes?.news);
        setisVisible(true);
      }
    }
  };

  useEffect(() => {
    checkIfAppOutdated();
  }, []);

  return { isVisible, news };
};

export default useUpdateApp;
