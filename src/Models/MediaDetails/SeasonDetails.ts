import { MediaSchema } from '../Media'
import { EpisodeDetailsSchema } from './EpisodeDetails'
import { z } from 'zod'

export const zSeasonDetails = MediaSchema.extend({
  number: z.number(),
  episode_count: z.number().optional(),
  episodes: z.array(EpisodeDetailsSchema).optional(),
  aired_episodes: z.number().optional(),
  overview: z.string().nullish(),
  first_aired: z.string().nullish(),
  network: z.string().optional(),
})

export type SeasonDetails = z.infer<typeof zSeasonDetails>
