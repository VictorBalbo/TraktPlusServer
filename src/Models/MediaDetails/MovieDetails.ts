import { z } from 'zod'
import { zMedia } from '../Media'

export const zMovieDetails = zMedia.extend({
  tagline: z.string(),
  overview: z.string(),
  released: z.string(),
  runtime: z.number(),
  country: z.string(),
  trailer: z.string().nullish(),
  homepage: z.string().nullish(),
  status: z.string(),
  language: z.string(),
  genres: z.array(z.string()),
  certification: z.string(),
})

export type MovieDetails = z.infer<typeof zMovieDetails>
