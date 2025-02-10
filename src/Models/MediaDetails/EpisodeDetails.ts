import { z } from 'zod'
import { MediaSchema } from '..'

export const EpisodeDetailsSchema = MediaSchema.extend({
  season: z.number(),
  number: z.number(),
  overview: z.string().optional(),
  first_aired: z.string().optional(),
  runtime: z.number().optional(),
  episode_type: z.string().optional(),
})

export type EpisodeDetails = z.infer<typeof EpisodeDetailsSchema>
