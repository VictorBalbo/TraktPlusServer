import { zSeasonDetails } from './SeasonDetails'
import { z } from 'zod'
import { MediaDetailsSchema } from '..'

const airsSchema = z.object({
  day: z.string().nullish(),
  time: z.string().nullish(),
  timezone: z.string().nullish(),
})

export enum ShowStatus {
  ReturningSearies = 'returning series',
  Continuing = 'continuing',
  InProduction = 'in production',
  Planned = 'planned',
  Upcoming = 'upcoming',
  Pilot = 'pilot',
  Canceled = 'canceled',
  Ended = 'ended',
}

export const ShowDetailsSchema = MediaDetailsSchema.extend({
  airs: airsSchema.optional(),
  runtime: z.number().optional(),
  certification: z.string().optional(),
  network: z.string().optional(),
  country: z.string().optional(),
  trailer: z.string().nullish(),
  homepage: z.string().nullish(),
  status: z.nativeEnum(ShowStatus).optional(),
  aired_episodes: z.number().optional(),
  seasons: z.array(zSeasonDetails),
})

export type ShowDetails = z.infer<typeof ShowDetailsSchema>
