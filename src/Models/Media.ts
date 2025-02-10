import { z } from 'zod'
import { IdsSchema } from './Ids'
import { MediaImagesSchema } from './MediaImages'

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

export type Media = z.infer<typeof MediaSchema>
