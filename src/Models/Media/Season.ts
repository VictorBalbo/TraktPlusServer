import { z } from 'zod'
import { EpisodeSchema, MediaDetailsSchema, MediaSchema } from '..'

export const SeasonSchema = MediaSchema.extend({
  number: z.number(),
  episode_count: z.number().optional(),
  episodes: z.array(EpisodeSchema).optional(),
  aired_episodes: z.number().optional(),
  show: MediaSchema,
})

export const SeasonDetailsSchema = MediaDetailsSchema.extend({
  number: z.number(),
  episode_count: z.number().optional(),
  episodes: z.array(EpisodeSchema).optional(),
  aired_episodes: z.number().optional(),
  network: z.string().optional(),
  show: MediaSchema,
})

export type Season = z.infer<typeof SeasonSchema>
export type SeasonDetails = z.infer<typeof SeasonDetailsSchema>
