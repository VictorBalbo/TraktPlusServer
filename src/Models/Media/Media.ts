import { z } from 'zod'
import {
  CreditsSchema,
  IdsSchema,
  MediaImagesSchema,
  ScoringsSchema,
  WatchProviderSchema,
} from '..'

export enum MediaType {
  Movie = 'movie',
  Show = 'show',
  Season = 'season',
  Episode = 'episode',
}

export const MediaSchema = z.object({
  title: z.string(),
  ids: IdsSchema,
  type: z.nativeEnum(MediaType),
  images: MediaImagesSchema.optional(),
})

const TrailerSchema = z.object({
  iso_639_1: z.string(),
  name: z.string(),
  url: z.string(),
  type: z.string(),
})

export const MediaDetailsSchema = MediaSchema.extend({
  tagline: z.string().optional(),
  overview: z.string().nullish(),
  released: z.string().nullish(),
  genres: z.array(z.string()).optional(),
  providers: z.array(WatchProviderSchema).optional(),
  scorings: ScoringsSchema.optional(),
  credits: CreditsSchema.optional(),
  certification: z.string().nullish(),
  runtime: z.number().optional(),
  trailers: z.array(TrailerSchema).nullish(),
  homepage: z.string().nullish(),
})

export type Media = z.infer<typeof MediaSchema>

export type Trailer = z.infer<typeof TrailerSchema>
export type MediaDetails = z.infer<typeof MediaDetailsSchema>
