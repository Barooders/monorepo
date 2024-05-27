import { IFileService, Logger, TransactionBaseService } from '@medusajs/medusa';
import { S3 } from 'aws-sdk';
import axios from 'axios';
import sharp from 'sharp';

type InjectedDependencies = {
  fileService: IFileService;
  logger: Logger;
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
  protected logger_: Logger;
  protected s3: S3;
  private BUCKET_NAME = 'barooders-medusa-staging';
  private PATH_PREFIX = 'products';

  constructor({ fileService, logger }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.fileService_ = fileService;
    this.logger_ = logger;
    this.s3 = new S3({
      apiVersion: '2006-03-01',
      accessKeyId: 'AKIAYMCN75NMHGB757M2',
      secretAccessKey: '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',
    });
  }

  private uploadFile(fileName: string, content: Buffer) {
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: `${this.PATH_PREFIX}/${fileName}`,
      Body: content,
    };

    return this.s3.upload(params, function (err, data) {
      if (err != null) {
        throw err;
      }
      return data;
    });
  }

  private publicUrl(fileName: string) {
    return `https://${this.BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  }

  async multiFormatUploadFromUrl({
    url,
    fileName,
  }: {
    url: string;
    fileName: string;
  }): Promise<any> {
    const input = (
      await axios({
        url,
        responseType: 'arraybuffer',
      })
    ).data as Buffer;

    const results = await Promise.all(
      Object.keys(SIZE_CONFIG).map(async (size) => {
        const { width, height } = SIZE_CONFIG[size];
        const output = await sharp(input)
          .resize(width, height)
          .png()
          .toBuffer();

        return this.publicUrl(
          (await this.uploadFile(`${fileName}-${size}.png`, output).promise())
            .Key,
        );
      }),
    );

    return results;
  }
}

export default MultiFormatImageService;
