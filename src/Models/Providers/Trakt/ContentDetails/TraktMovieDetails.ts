import { zIds } from '../../../Ids'
import { z } from 'zod'

export const zTraktMovieDetails = z.object({
  title: z.string(),
  ids: zIds,
  year: z.number().optional(),
  tagline: z.string(),
  overview: z.string(),
  released: z.string(),
  runtime: z.number(),
  country: z.string(),
  trailer: z.string(),
  homepage: z.string(),
  status: z.string(),
  rating: z.number(),
  votes: z.number(),
  comment_count: z.number(),
  updated_at: z.string(),
  language: z.string(),
  genres: z.array(z.string()),
  certification: z.string(),
})

export type TraktMovieDetails = z.infer<typeof zTraktMovieDetails>
