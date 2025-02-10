import { MediaImages, MediaType } from '../Models'
import { GetImagesResponse, TmdbImage } from '../Models/Providers/Tmdb'
import { tmdbAccessToken } from '../constants'

export class TmdbService {
  private static tmdbApiBaseUri = 'https://api.themoviedb.org/3'
  private static imageSizes = {
    backdrops: ['w300', 'w780', 'w1280', 'original'],
    posters: ['w92', 'w154', 'w185', 'w342', 'w500'],
    stills: ['w92', 'w185', 'w300'],
  }

  static sendTmdbGetRequest = async <T>(uri: string) => {
    const options = TmdbService.getRequestOptions()
    const response = await fetch(`${TmdbService.tmdbApiBaseUri}${uri}`, options)
    if (response.ok) {
      const value = await response.json()
      return value as T
    } else {
      throw new Error(
        `Error on sending command to Tmdb. Uri: ${uri} - Code: ${response.status} - Message: ${response.statusText}`,
      )
    }
  }

  static getMediaImages = async (
    mediaType: MediaType,
    id?: number,
    seasonId?: number,
    episodeId?: number,
  ) => {
    if (!id) {
      return
    }
    let url: string
    switch (mediaType) {
      case MediaType.Movie:
        url = `/movie/${id}/images`
        break
      case MediaType.Show:
        url = `/tv/${id}/images`
        break
      case MediaType.Season:
        url = `/tv/${id}/season/${seasonId}/images`
        break
      case MediaType.Episode:
        url = `/tv/${id}/season/${seasonId}/episode/${episodeId}/images`
        break
    }

    try {
      const imagesResponse = await TmdbService.sendTmdbGetRequest<GetImagesResponse>(url)
      const images: MediaImages = {
        backdrop: TmdbService.selectImage(imagesResponse.backdrops, 'backdrops'),
        poster: TmdbService.selectImage(imagesResponse.posters, 'posters'),
        still: TmdbService.selectImage(imagesResponse.stills, 'stills'),
      }

      return images
    } catch (e) {
      console.error(e)
    }
  }

  private static selectImage = (
    images: TmdbImage[],
    imageType: 'backdrops' | 'posters' | 'stills',
  ) => {
    if (!images?.length) {
      return
    }
    let image = images?.sort((a, b) => {
      // Prioritize by language English > Portuguese
      if (a.iso_639_1 === 'en' && b.iso_639_1 !== 'en') return -1
      if (b.iso_639_1 === 'en' && a.iso_639_1 !== 'en') return 1

      if (a.iso_639_1 === 'pt' && b.iso_639_1 !== 'pt') return -1
      if (b.iso_639_1 === 'pt' && a.iso_639_1 !== 'pt') return 1

      // Finally, sort by vote_average in descending order
      return (b.vote_average ?? 0) - (a.vote_average ?? 0)
    })?.[0]

    return image.file_path
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
