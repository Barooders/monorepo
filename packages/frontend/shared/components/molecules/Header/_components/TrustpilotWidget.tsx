'use client';

import { useEffect, useRef } from 'react';

const TrustpilotWidget = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (window.Trustpilot && ref.current) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <>
        <div
          className="trustpilot-widget"
          data-locale="fr-FR"
          data-template-id="5419b6a8b0d04a076446a9ad"
          data-businessunit-id="61724ed16359eeffdfeeebbc"
          data-style-height="24px"
          data-style-width="100%"
          data-theme="dark"
          data-font-family="Roboto"
          data-text-color="#ffffff"
          data-style-alignment="left"
        >
          <a
            href="https://fr.trustpilot.com/review/barooders.com"
            target="_blank"
            rel="noopener noreferrer"
          >
          </a>
        </div>
    </>
  );
};

export default TrustpilotWidget;
