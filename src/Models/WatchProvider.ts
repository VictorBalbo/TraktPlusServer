import { z } from 'zod'

const ProviderSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
})

export const WatchProviderSchema = z.object({
  monetizationType: z.string(),
  qualityType: z.string(),
  providerUri: z.string(),
  elementCount: z.number(),
  provider: ProviderSchema,
})

export type WatchProvider = z.infer<typeof WatchProviderSchema>
