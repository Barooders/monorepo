import { IFileService, TransactionBaseService } from '@medusajs/medusa';
import fs from 'fs';
import { parse } from 'path';
import { ParsedPath } from 'path/posix';
import sharp from 'sharp';

type InjectedDependencies = {
  fileService: IFileService;
};

const SIZE_CONFIG = {
  small: {
    width: 200,
    height: 200,
  },
  medium: {
    width: 400,
    height: 400,
  },
  large: {
    width: 800,
    height: 800,
  },
};

class MultiFormatImageService extends TransactionBaseService {
  protected fileService_: IFileService;

  constructor({ fileService }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.fileService_ = fileService;
  }

  async multiFormatUpload(file: Express.Multer.File): Promise<any> {
    const parsedFilename = parse(file.originalname);

    const results = await Promise.all(
      Object.keys(SIZE_CONFIG).map(
        async (size) =>
          await this.uploadResizedImage(file, size, parsedFilename),
      ),
    );

    fs.unlinkSync(file.path);
    return results;
  }

  private async uploadResizedImage(
    file: Express.Multer.File,
    size: string,
    parsedFilename: ParsedPath,
  ) {
    const tempFile = `uploads/${file.filename}-${size}`;

    const { width, height } = SIZE_CONFIG[size];

    await sharp(file.path).resize(width, height).toFile(tempFile);

    const result = await this.fileService_.upload({
      ...file,
      filename: `${file.filename}-${size}`,
      path: tempFile,
      originalname: `${parsedFilename.name}-${size}${parsedFilename.ext}`,
    });

    fs.unlinkSync(tempFile);
    return result;
  }
}

export default MultiFormatImageService;
