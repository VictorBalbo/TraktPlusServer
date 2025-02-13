import { z } from 'zod'
import { MediaSchema, MediaDetailsSchema, MediaType } from '..'

export const MovieSchema = MediaSchema.extend({
  type: z.nativeEnum(MediaType).default(MediaType.Movie),
})

export const MovieDetailsSchema = MediaDetailsSchema.extend({
  country: z.string(),
  status: z.string(),
  language: z.string(),
})

export type Movie = z.infer<typeof MovieSchema>
export type MovieDetails = z.infer<typeof MovieDetailsSchema>
