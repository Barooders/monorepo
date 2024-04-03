'use client';

import { useAuth } from '@/hooks/useAuth';
import { SearchB2BVariantDocument } from 'shared-types';

const AdminHitHelper = ({
  hit: { handle, vendor },
}: {
  hit: SearchB2BVariantDocument;
}) => {
  const { isAdmin } = useAuth();

  if (!isAdmin()) return <></>;

  return (
    <div
      className="absolute z-10 bg-slate-200 bg-opacity-75 p-1 text-xs"
      data-ref="admin-hit-helper"
    >
      <a href={`/products/${handle}`}>Voir produit</a>
      <p>{vendor}</p>
    </div>
  );
};

export default AdminHitHelper;
