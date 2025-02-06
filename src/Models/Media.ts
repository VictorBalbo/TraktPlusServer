import { z } from 'zod'
import { zIds } from './Ids'
import { zMediaImages } from './MediaImages'
import { zWatchProvider } from './WatchProvider'
import { zScorings } from './Scorings'

export enum MediaType {
  Movie = 'movie',
  Show = 'show',
  Season = 'season',
  Episode = 'episode',
}

export const zMedia = z.object({
  title: z.string(),
  ids: zIds,
  type: z.nativeEnum(MediaType),
  year: z.number().optional(),
  images: zMediaImages.optional(),
  providers: z.array(zWatchProvider).optional(),
  scorings: zScorings.optional(),
})

export type Media = z.infer<typeof zMedia>