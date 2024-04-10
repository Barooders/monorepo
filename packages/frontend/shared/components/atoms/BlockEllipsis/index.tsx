import { getDictionary } from '@/i18n/translate';
import { useState } from 'react';

type PropsType = {
  children: React.ReactNode;
};

const dict = getDictionary('fr');

const BlockEllipsis: React.FC<PropsType> = ({ children }) => {
  const [showMore, setShowMore] = useState(false);
  return (
    <div className="flex flex-col">
      <div
        className={`relative w-full overflow-hidden ${
          !showMore ? 'max-h-40' : ''
        }`}
      >
        {children}
        {!showMore && (
          <div className="absolute bottom-0 h-7 w-full bg-gradient-to-b from-transparent to-white" />
        )}
      </div>
      <button
        className="mt-2 self-start text-sm font-semibold text-slate-700 underline"
        onClick={() => setShowMore(!showMore)}
      >
        {showMore
          ? dict.components.blockEllipsis.seeLess
          : dict.components.blockEllipsis.seeMore}
      </button>
    </div>
  );
};

export default BlockEllipsis;
