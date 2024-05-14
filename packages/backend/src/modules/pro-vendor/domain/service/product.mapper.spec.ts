import { Image } from '@libs/domain/product.interface';
import { Logger } from '@nestjs/common';
import { skipImages } from './product.mapper';

describe('Product Mapper', () => {
  describe('skipImages', () => {
    const logger = console as unknown as Logger;
    it(`should skip first image`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const ignoredImagesIndex = [0];

      expect(
        skipImages({ images, ignoredImagesIndex, logger })
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('2,3');
    });

    it(`should skip second image`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const ignoredImagesIndex = [1];

      expect(
        skipImages({ images, ignoredImagesIndex, logger })
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('1,3');
    });

    it(`should skip last image`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const ignoredImagesIndex = [-1];

      expect(
        skipImages({ images, ignoredImagesIndex, logger })
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('1,2');
    });

    it(`should second to last image`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const ignoredImagesIndex = [-2];

      expect(
        skipImages({ images, ignoredImagesIndex, logger })
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('1,3');
    });

    it(`should not skip image if array is empty`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const ignoredImagesIndex: number[] = [];

      expect(
        skipImages({ images, ignoredImagesIndex, logger })
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('1,2,3');
    });
  });
});
