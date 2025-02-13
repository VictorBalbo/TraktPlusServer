export interface TmdbMediaDetails {
  id: number
  tagline?: string
  overview?: string
  genres?: Genre[]
  adult?: boolean
  poster_path: string
  backdrop_path: string
  videos?: TmdbVideos
}

interface Genre {
  id: number
  name: string
}

export interface TmdbVideos {
  results: VideoResult[]
}
interface VideoResult {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}
