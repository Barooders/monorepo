import { Image } from '@libs/domain/product.interface';
import { skipImages } from './product.mapper';

describe('Product Mapper', () => {
  describe('skipImages', () => {
    it(`should skip first image`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const skippedImages = [0];

      expect(
        skipImages(images, skippedImages)
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('2,3');
    });

    it(`should skip second image`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const skippedImages = [1];

      expect(
        skipImages(images, skippedImages)
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('1,3');
    });

    it(`should skip last image`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const skippedImages = [-1];

      expect(
        skipImages(images, skippedImages)
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('1,2');
    });

    it(`should second to last image`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const skippedImages = [-2];

      expect(
        skipImages(images, skippedImages)
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('1,3');
    });

    it(`should not skip image if array is empty`, () => {
      const images: Image[] = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const skippedImages: number[] = [];

      expect(
        skipImages(images, skippedImages)
          .map((s) => s.id)
          .join(','),
      ).toStrictEqual('1,2,3');
    });
  });
});
