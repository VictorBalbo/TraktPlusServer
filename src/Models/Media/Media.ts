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
})

export type Media = z.infer<typeof MediaSchema>

export type MediaDetails = z.infer<typeof MediaDetailsSchema>
