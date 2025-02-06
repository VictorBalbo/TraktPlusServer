import { zSeasonDetails } from './SeasonDetails'
import { z } from 'zod'
import { zMedia } from '../Media'

const airsSchema = z.object({
  day: z.string(),
  time: z.string(),
  timezone: z.string(),
})

export const zShowDetails = zMedia.extend({
  tagline: z.string().optional(),
  overview: z.string().optional(),
  first_aired: z.string().optional(),
  airs: airsSchema.optional(),
  runtime: z.number().optional(),
  certification: z.string().optional(),
  network: z.string().optional(),
  country: z.string().optional(),
  trailer: z.string().optional(),
  homepage: z.string().optional(),
  status: z.string().optional(),
  genres: z.array(z.string()).optional(),
  aired_episodes: z.number().optional(),
  seasons: z.array(zSeasonDetails),
})

export type ShowDetails = z.infer<typeof zShowDetails>
