export interface GetImagesResponse {
  backdrops: TmdbImage[]
  id: number
  logos: TmdbImage[]
  posters: TmdbImage[]
  stills: TmdbImage[]
}

export interface TmdbImage {
  aspect_ratio: number
  height: number
  iso_639_1: string
  file_path: string
  vote_average?: number
  vote_count?: number
  width: number
}
