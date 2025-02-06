import { z } from 'zod'

const zProvider = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
})

export const zWatchProvider = z.object({
  monetizationType: z.string(),
  qualityType: z.string(),
  providerUri: z.string(),
  elementCount: z.number(),
  provider: zProvider,
})

export type WatchProvider = z.infer<typeof zWatchProvider>
