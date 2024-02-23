import { getDictionary } from '@/i18n/translate';
import Link from '@/components/atoms/Link';
import { RelatedCollectionType } from '../types';

type PropsType = {
  relatedCollections: RelatedCollectionType[];
};

const dict = getDictionary('fr');

const RelatedCollections: React.FC<PropsType> = ({ relatedCollections }) => {
  return (
    <div className="my-3">
      <p className="mb-2 font-semibold">
        {dict.search.relatedCollectionsTitle}
      </p>
      <ul className="flex w-full flex-wrap gap-3">
        {relatedCollections.map((relatedCollection) => (
          <li
            className="rounded border border-gray-700"
            key={`${relatedCollection.title}-${relatedCollection.handle}`}
          >
            <Link
              className="flex px-2 py-1 text-gray-700"
              href={`/collections/${relatedCollection.handle}`}
            >
              {relatedCollection.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RelatedCollections;
