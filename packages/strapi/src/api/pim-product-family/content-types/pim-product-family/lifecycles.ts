import { Event } from '@strapi/database/lib/lifecycles';

const beforeCreate = async (event: Event) => {
  await addDisplayNameToEvent(event);
};

const beforeUpdate = async (event: Event) => {
  await addDisplayNameToEvent(event);
};

const addDisplayNameToEvent = async (event: Event) => {
  const { data } = event.params;

  const brandId = await getBrandId(event);

  if (brandId == null) return;

  const brand = await strapi.entityService.findOne(
    'api::pim-brand.pim-brand',
    brandId,
  );

  const displayName = `${data.name} - ${brand.name}`;
  data.displayName = displayName;
};

const getBrandId = async (event: Event) => {
  const { data, where } = event.params;

  const brandId = data?.brand?.connect[0]?.id;
  if (brandId == null) {
    const familyId = where?.id;
    if (familyId == null) return;

    const family = await strapi.entityService.findOne(
      'api::pim-product-family.pim-product-family',
      familyId,
      {
        populate: ['brand'],
      },
    );

    return family.brand.id;
  }

  return brandId;
};

export default {
  beforeCreate,
  beforeUpdate,
};
