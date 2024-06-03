import envConfig from '../config/env/env.config';
import { createHttpClient } from './create-http-client';

export const backendClient = createHttpClient(envConfig.backend.baseUrl);
