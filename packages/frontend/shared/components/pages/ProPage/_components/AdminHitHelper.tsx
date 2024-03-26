'use client';

import { useAuth } from '@/hooks/useAuth';
import { SearchB2BVariantDocument } from 'shared-types';

const AdminHitHelper = ({
  hit: { handle },
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
    </div>
  );
};

export default AdminHitHelper;
