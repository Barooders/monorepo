import Link from '@/components/atoms/Link';
import { useEffect, useRef } from 'react';

const Trustpilot = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (window.Trustpilot && ref.current) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <>
      <div
        ref={ref}
        className="trustpilot-widget"
        data-locale="fr-FR"
        data-template-id="53aa8912dec7e10d38f59f36"
        data-businessunit-id="61724ed16359eeffdfeeebbc"
        data-style-height="140px"
        data-style-width="100%"
        data-theme="light"
        data-stars="4,5"
        data-review-languages="fr"
      >
        <Link
          href="https://fr.trustpilot.com/review/barooders.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot
        </Link>
      </div>
    </>
  );
};

export default Trustpilot;
