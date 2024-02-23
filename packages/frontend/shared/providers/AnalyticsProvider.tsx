'use client';

import { initAnalytics } from '@/analytics';
import { useState } from 'react';

type PropsType = {
  children: React.ReactNode;
};

const AnalyticsProvider: React.FC<PropsType> = ({ children }) => {
  const [isSetUp, setIsSetup] = useState(false);

  if (!isSetUp) {
    initAnalytics();
    setIsSetup(true);
  }

  return <>{children}</>;
};

export default AnalyticsProvider;
