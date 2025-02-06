import { zMedia } from '../Media'
import { zEpisodeDetails } from './EpisodeDetails'
import { z } from 'zod'

export const zSeasonDetails = zMedia.extend({
  number: z.number(),
  episode_count: z.number().optional(),
  aired_episodes: z.number().optional(),
  overview: z.string().nullish(),
  first_aired: z.string().nullish(),
  network: z.string().optional(),
  episodes: z.array(zEpisodeDetails).optional(),
})

export type SeasonDetails = z.infer<typeof zSeasonDetails>
