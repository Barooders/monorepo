'use client';

import { SNOWFALL_OVERLAY_ANCHOR } from '@/config';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ReactSnowfall from 'react-snowfall';
import Konami from 'react-konami-code';

const Snowfall = () => {
  const [snowfallConfig, setSnowFallConfig] = useState({ snowflakeCount: 0 });
  const [topElement, setTopElement] = useState<HTMLElement | null>(null);

  const getTopElement = () =>
    document.getElementById(SNOWFALL_OVERLAY_ANCHOR) ?? null;

  useEffect(() => {
    setTopElement(getTopElement());
  }, []);

  const createSpecialConfig = () => {
    const snowflake1 = document.createElement('img');
    snowflake1.src = '/barooders-picto.png';

    return {
      wind: [1, 8],
      rotationSpeed: [2, 5],
      images: [snowflake1],
      radius: [15, 35],
      snowflakeCount: 300,
    };
  };

  if (!topElement) return <></>;

  return (
    <>
      <Konami action={() => setSnowFallConfig(createSpecialConfig())} />
      {createPortal(<ReactSnowfall {...snowfallConfig} />, topElement)}
    </>
  );
};

export default Snowfall;
