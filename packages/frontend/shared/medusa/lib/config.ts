import envConfig from "@/config/env"
import Medusa from "@medusajs/medusa-js"

export const medusaClient = new Medusa({
  baseUrl: envConfig.medusa.baseUrl,
  maxRetries: 3,
})
