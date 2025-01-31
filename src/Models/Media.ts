import { Ids, MediaImages } from '../Models'


export interface Media {
  title: string
  year?: number
  ids: Ids
  type: MediaType
  images?: MediaImages
}

export interface Episode extends Media {
  season: number
  number: number
  show: string
}

export enum MediaType {
  Movie = 'movie',
  Show = 'show', 
  Season = 'season',
  Episode = 'episode'
}
