'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CollectionPreview from '../../Builder/_components/CollectionPreview';

const CollectionPreviewInjector: React.FC = () => {
  const [featuredCollections, setFeaturedCollectionEls] = useState<
    { collectionHandle: string; el: Element }[]
  >([]);

  useEffect(() => {
    const featuredCollectionEls = [
      ...document.getElementsByClassName('barooders__featured-collections'),
    ];

    if (featuredCollectionEls.length > 0) {
      setFeaturedCollectionEls(
        featuredCollectionEls.map((el) => ({
          el,
          collectionHandle:
            el.getAttribute('data-collection-handle')?.toString() ?? '',
        })),
      );
    }
  }, []);

  return (
    <>
      {featuredCollections.map((featuredCollection) =>
        createPortal(
          <CollectionPreview
            collectionHandle={featuredCollection.collectionHandle}
          />,
          featuredCollection.el,
        ),
      )}
    </>
  );
};

export default CollectionPreviewInjector;
