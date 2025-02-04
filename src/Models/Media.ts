import { Ids, MediaImages, Scorings, WatchProvider } from '../Models'

export interface Media {
  title: string
  ids: Ids
  type: MediaType
  year?: number
  images?: MediaImages
  providers?: WatchProvider[]
  scorings?: Scorings
}

export enum MediaType {
  Movie = 'movie',
  Show = 'show',
  Season = 'season',
  Episode = 'episode',
}
