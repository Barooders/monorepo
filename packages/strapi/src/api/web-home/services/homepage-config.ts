export const extractEntity = (
  entityName: string,
  config: Record<string, unknown> = {},
) => strapi.entityService.findMany(entityName, config);

export const getHomepageConfig = async (): Promise<Record<string, unknown>> => {
  const webHome = await extractEntity('api::web-home.web-home', {
    populate: { Header: true },
  });

  return webHome;
};
