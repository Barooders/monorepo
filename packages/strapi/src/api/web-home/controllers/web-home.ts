/**
 * web-home controller
 */

import { factories } from '@strapi/strapi';
import { getHomepageConfig } from '../services/homepage-config';

export default factories.createCoreController('api::web-home.web-home', {
  async getHomepageConfig(ctx) {
    ctx.response.body = { config: getHomepageConfig() };
  },
});
