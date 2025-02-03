import { Ids, MediaImages, WatchProvider } from '../Models'

export interface Media {
  title: string
  ids: Ids
  type: MediaType
  year?: number
  images?: MediaImages
  providers?: WatchProvider[]
}

export enum MediaType {
  Movie = 'movie',
  Show = 'show',
  Season = 'season',
  Episode = 'episode',
}
