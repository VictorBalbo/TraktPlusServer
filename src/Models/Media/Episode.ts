import { z } from 'zod'
import { MediaDetailsSchema, MediaSchema, SeasonSchema } from '..'

export const EpisodeSchema = MediaSchema.extend({
  showId: z.number(),
  showTitle: z.string().optional(),
  seasonNumber: z.number(),
  number: z.number(),  
  episode_type: z.string().optional(),
})

export const EpisodeDetailsSchema = MediaDetailsSchema.extend({
  show: MediaSchema,
  seasonNumber: z.number(),
  seasonTitle: z.string(),
  number: z.number(),
  episode_type: z.string().optional(),
})

export type Episode = z.infer<typeof EpisodeSchema>
export type EpisodeDetails = z.infer<typeof EpisodeDetailsSchema>
