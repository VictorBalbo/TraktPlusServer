import { zSeasonDetails } from './SeasonDetails'
import { z } from 'zod'
import { zMedia } from '../Media'

const airsSchema = z.object({
  day: z.string(),
  time: z.string(),
  timezone: z.string(),
})

export const zShowDetails = zMedia.extend({
  tagline: z.string(),
  overview: z.string(),
  first_aired: z.string(),
  airs: airsSchema,
  runtime: z.number(),
  certification: z.string(),
  network: z.string(),
  country: z.string(),
  trailer: z.string(),
  homepage: z.string(),
  status: z.string(),
  genres: z.array(z.string()),
  aired_episodes: z.number(),
  seasons: z.array(zSeasonDetails).optional(),
})

export type ShowDetails = z.infer<typeof zShowDetails>
