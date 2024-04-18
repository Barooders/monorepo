import type { MiddlewaresConfig } from '@medusajs/medusa';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const config: MiddlewaresConfig = {
  routes: [
    {
      matcher: '/admin/uploads/multi-format',
      middlewares: [upload.array('files')],
    },
  ],
};
