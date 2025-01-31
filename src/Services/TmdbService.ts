import { Image } from 'src/Models/MediaImages'
import { MediaImages, MediaType } from '../Models'
import { GetImagesResponse, TmdbImage } from '../Models/Tmdb'
import { tmdbAccessToken } from '../constants'

const tmdbApiBaseUri = 'https://api.themoviedb.org/3'
const imageSizes = {
  backdrops: ['w300', 'w780', 'w1280'],
  logos: ['w45', 'w92', 'w154', 'w185', 'w300'],
  posters: ['w92', 'w154', 'w185', 'w342', 'w500'],
}

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
      const images: MediaImages = {
        backdrops: TmdbService.selectImage(imagesResponse.backdrops, 'backdrops'),
        logos: TmdbService.selectImage(imagesResponse.logos, 'logos'),
        posters: TmdbService.selectImage(imagesResponse.posters, 'posters'),
      }

      return images
    } catch (e) {
      console.error(e)
    }
  }

  private static selectImage = (images: TmdbImage[], imageType: 'backdrops' | 'logos' | 'posters') => {
    let image = images?.sort((a, b) => {
      // Prioritize by language English > Portuguese
      if (a.iso_639_1 === 'en' && b.iso_639_1 !== 'en') return -1
      if (b.iso_639_1 === 'en' && a.iso_639_1 !== 'en') return 1

      if (a.iso_639_1 === 'pt' && b.iso_639_1 !== 'pt') return -1
      if (b.iso_639_1 === 'pt' && a.iso_639_1 !== 'pt') return 1

      // Finally, sort by vote_average in descending order
      return (b.vote_average ?? 0) - (a.vote_average ?? 0)
    })?.[0]

    const selectImage: Image = {
      ...image,
      base_path: 'https://image.tmdb.org/t/p',
      sizes: imageSizes[imageType],
    }
    return selectImage
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
