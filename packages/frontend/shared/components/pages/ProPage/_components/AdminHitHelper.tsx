'use client';

import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';
import { SearchB2BVariantDocument } from 'shared-types';

const AdminHitHelper = ({
  hit: { product_shopify_id, vendor },
}: {
  hit: SearchB2BVariantDocument;
}) => {
  const { isAdmin } = useAuth();
  const [shouldShow, setShouldShow] = useState(true);
  useKeyPressEvent('?', () => {
    setShouldShow(!shouldShow);
  });

  if (!isAdmin() || !shouldShow) return <></>;

  const retoolLink = `https://barooders.retool.com/apps/a95e27ba-5d41-11ee-8b5b-f3f500dba9d6/Product%20management?product_id=${product_shopify_id}&market=B2B`;

  return (
    <div
      className="absolute z-10 bg-slate-200 bg-opacity-75 p-1 text-xs"
      data-ref="admin-hit-helper"
    >
      <a
        target="_blank"
        rel="noreferrer noopener"
        href={retoolLink}
      >
        Voir produit
      </a>
      <p>{vendor}</p>
    </div>
  );
};

export default AdminHitHelper;
