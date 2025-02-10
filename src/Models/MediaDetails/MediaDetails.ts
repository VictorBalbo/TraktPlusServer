import { z } from 'zod'
import { MediaSchema } from '..'
import { CreditsSchema } from '..'
import { ScoringsSchema } from '..'
import { WatchProviderSchema } from '..'

export const MediaDetailsSchema = MediaSchema.extend({
  tagline: z.string().optional(),
  overview: z.string().optional(),
  released: z.string().optional(),
  genres: z.array(z.string()).optional(),
  providers: z.array(WatchProviderSchema).optional(),
  scorings: ScoringsSchema.optional(),
  credits: CreditsSchema.optional(),
})

export type MediaDetails = z.infer<typeof MediaDetailsSchema>
