import HorizontalImageList from '@/components/atoms/HorizontalImageList';
import { ChildCollectionType } from '../types';

type PropsType = {
  childCollections: ChildCollectionType[];
};

const ChildCollections: React.FC<PropsType> = ({ childCollections }) => {
  const collectionItems =
    childCollections.map((collection) => ({
      pictureUrl: collection.imageUrl,
      title: collection.shortName ?? collection.title,
      link: `/collections/${collection.handle}`,
    })) ?? [];

  return (
    <HorizontalImageList
      items={collectionItems.filter((collection) => !!collection.pictureUrl)}
    />
  );
};

export default ChildCollections;
