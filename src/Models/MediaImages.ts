export interface MediaImages {
  backdrops: Image
  logos: Image
  posters: Image
}

export interface Image {
  aspect_ratio: number
  height: number
  width: number
  iso_639_1: string
  file_path: string
}