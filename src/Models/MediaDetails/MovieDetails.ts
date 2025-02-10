import { z } from 'zod'
import { MediaDetailsSchema } from '..'

export const MovieDetailsSchema = MediaDetailsSchema.extend({
  runtime: z.number(),
  country: z.string(),
  trailer: z.string().nullish(),
  homepage: z.string().nullish(),
  status: z.string(),
  language: z.string(),
  certification: z.string().nullish(),
})

export type MovieDetails = z.infer<typeof MovieDetailsSchema>
