import { MedusaRequest, MedusaResponse } from '@medusajs/medusa';
import MultiFormatImageService from '../../../../services/multi-format-image';

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse,
): Promise<void> {
  const multiFormatImageService: MultiFormatImageService = req.scope.resolve(
    'multiFormatImageService',
  );

  const files = (req as any).files as Express.Multer.File[] | undefined;
  if (!files) {
    res.status(400).json({ message: 'No files uploaded' });
    return;
  }

  const result = await Promise.all(
    files.map(async (f) => {
      return await multiFormatImageService.multiFormatUpload(f);
    }),
  );

  res.status(200).json({ uploads: result });
}
