import 'dotenv.config';
import pim from './pim';
import { strapiClient } from '@libs/infrastructure/strapi/strapi.helper';
import qs from 'qs';
import { first } from 'lodash';
import { jsonStringify } from '@libs/helpers/json';

// eslint-disable-next-line no-console
const wrappedConsole = console;

type PimType = {
  model: string;
  brand: string;
  categoryId: string;
  imageSrc: string;
  filename: string;
  categoryName: string;
};

export type StrapiEntity<T> = {
  id: number;
  attributes: T;
};

export type StrapiEntityList<T> = {
  data: StrapiEntity<T>[];
};

const uploadImage = async (imageURL: string) => {
  try {
    const myImage = await fetch(imageURL);

    if (!myImage.ok) return null;

    const myBlob = await myImage.blob();

    const formData = new FormData();
    formData.append('files', myBlob, imageURL);
    formData.append('ref', 'api::event.event');
    formData.append('field', 'image');
    wrappedConsole.log(formData);
    const result = await strapiClient<{ id: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    });

    return result.id;
  } catch (e) {
    wrappedConsole.error(`Could not upload image from ${imageURL}: ${e}`);
    return null;
  }
};

const getBrandId = async (brand: string) => {
  const searchParams = qs.stringify({
    filters: {
      name: { $eq: brand },
    },
  });
  const result = await strapiClient<StrapiEntityList<{ name: string }>>(
    `/api/pim-brands?${searchParams}`,
  );

  return first(result.data);
};

const checkModelExists = async (model: string) => {
  const searchParams = qs.stringify({
    filters: {
      name: { $eq: model },
    },
  });
  const result = await strapiClient<StrapiEntityList<{ name: string }>>(
    `/api/pim-product-models?${searchParams}`,
  );

  return result.data.length > 0;
};

const run = async () => {
  const pimData: PimType[] = pim;
  wrappedConsole.log(`Start import of ${pimData.length} models`);

  for (const model of pimData) {
    try {
      if (await checkModelExists(model.model)) continue;

      const brand = await getBrandId(model.brand);
      const imageId = model.imageSrc ? await uploadImage(model.imageSrc) : null;
      await strapiClient(`/api/pim-product-models`, {
        method: 'POST',
        body: jsonStringify({
          data: {
            name: model.model,
            pictures: imageId ? [imageId] : [],
            brand: brand?.id,
          },
        }),
      });
      wrappedConsole.log(`Created ${model.model}`);
    } catch (e) {
      wrappedConsole.error(`Could not create model ${model.model}`);
      wrappedConsole.error(e);
    }
  }
};

void run();
