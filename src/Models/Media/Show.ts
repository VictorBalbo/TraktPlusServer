import { z } from 'zod'
import { MediaDetailsSchema, MediaSchema, SeasonSchema } from '..'

export const ShowSchema = MediaSchema.extend({})

export const ShowDetailsSchema = MediaDetailsSchema.extend({
  network: z.string().optional(),
  country: z.string().optional(),
  status: z.string().optional(),
  aired_episodes: z.number().optional(),
  seasons: z.array(SeasonSchema),
})

export type Show = z.infer<typeof ShowDetailsSchema>
export type ShowDetails = z.infer<typeof ShowDetailsSchema>
