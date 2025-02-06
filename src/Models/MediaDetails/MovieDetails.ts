import { z } from 'zod'
import { zPeople } from '../People'
import { zMedia } from '../Media'

export const zMovieDetails = zMedia.extend({
  tagline: z.string(),
  overview: z.string(),
  released: z.string(),
  runtime: z.number(),
  country: z.string(),
  trailer: z.string(),
  homepage: z.string(),
  status: z.string(),
  language: z.string(),
  genres: z.array(z.string()),
  certification: z.string(),
  people: zPeople,
})

export type MovieDetails = z.infer<typeof zMovieDetails>
