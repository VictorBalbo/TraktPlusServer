import { MediaImages, MediaType } from '@/Models'
import { GetImagesResponse } from '@/Models/Tmdb'
import { tmdbAccessToken } from '@/constants'

let tmdbApiBaseUri = 'https://api.themoviedb.org/3'

export class TmdbService {
  static getMediaImages = async (id: number, mediaType: MediaType) => {
    let url: string
    switch (mediaType) {
      case MediaType.Movie:
        url = `${tmdbApiBaseUri}/movie/${id}/images`
        break
      case MediaType.Show:
        url = `${tmdbApiBaseUri}/tv/${id}/images`
        break
      case MediaType.Season:
        url = `${tmdbApiBaseUri}/tv/${id}/season/${id}images`
        break
      case MediaType.Episode:
        url = `${tmdbApiBaseUri}/tv/${id}/season/${id}/episode/${id}/images`
        break
    }
    const options = TmdbService.getRequestOptions()

    try {
      const response = await fetch(url, options)
      const imagesResponse = (await response.json()) as GetImagesResponse
      let images: MediaImages = {
        backdrops: imagesResponse.backdrops?.[0],
        logos: imagesResponse.logos?.[0],
        posters: imagesResponse.posters?.[0],
      }
      
      return TmdbService.addFullPathAddress(images)
    } catch (e) {
      console.error(e)
    }
  }

  private static addFullPathAddress = (images: MediaImages) => {
    if(images.backdrops) {
      images.backdrops.file_path = `https://image.tmdb.org/t/p/original${images.backdrops.file_path}`
    }
    if(images.logos) {
      images.logos.file_path = `https://image.tmdb.org/t/p/original${images.logos.file_path}`
    }
    if(images.posters) {
      images.posters.file_path = `https://image.tmdb.org/t/p/original${images.posters.file_path}`
    }
    return images
  }

  private static getRequestOptions = () => {
    return {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${tmdbAccessToken}`,
      },
    }
  }
}
