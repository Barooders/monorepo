'use client';

import { FullArticle } from '@/types';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import CollectionPreview from '../../Builder/_components/CollectionPreview';

export type PropsType = {
  article: FullArticle;
};

const DisplayCollection: React.FC<PropsType> = ({ article }) => {
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
  }, [article]);

  if (!article) throw new Error('Could not find article');

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

export default DisplayCollection;
