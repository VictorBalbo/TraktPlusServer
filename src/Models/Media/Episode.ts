import { z } from 'zod'
import { MediaSchema } from '..'

export const EpisodeSchema = MediaSchema.extend({
  show: MediaSchema,
  season: z.number(),
  number: z.number(),
  overview: z.string().nullish(),
  first_aired: z.string().nullish(),
  runtime: z.number().optional(),
  episode_type: z.string().optional(),
})

export type Episode = z.infer<typeof EpisodeSchema>
