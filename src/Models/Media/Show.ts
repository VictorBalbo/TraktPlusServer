import { z } from 'zod'
import { MediaDetailsSchema, MediaSchema, SeasonSchema } from '..'

export const ShowSchema = MediaSchema.extend({})

const airsSchema = z.object({
  day: z.string().nullish(),
  time: z.string().nullish(),
  timezone: z.string().nullish(),
})

export const ShowDetailsSchema = MediaDetailsSchema.extend({
  airs: airsSchema.optional(),
  network: z.string().optional(),
  country: z.string().optional(),
  trailer: z.string().nullish(),
  homepage: z.string().nullish(),
  status: z.string().optional(),
  aired_episodes: z.number().optional(),
  seasons: z.array(SeasonSchema),
})

export type Show = z.infer<typeof ShowDetailsSchema>
export type ShowDetails = z.infer<typeof ShowDetailsSchema>
