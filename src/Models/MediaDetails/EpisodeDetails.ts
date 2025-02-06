import { z } from 'zod'
import { zMedia } from '../Media'

export const zEpisodeDetails = zMedia.extend({
  show: z.string(),
  season: z.number(),
  number: z.number(),
  overview: z.string().optional(),
  first_aired: z.string().optional(),
  runtime: z.number().optional(),
  episode_type: z.string().optional(),
})

export type EpisodeDetails = z.infer<typeof zEpisodeDetails>
