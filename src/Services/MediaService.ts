import { Media, MediaType } from '../Models'
import { Recommendation, TraktContentResponse, Trending } from '../Models/Trakt'
import { TmdbService, TraktService } from '.'
export class MediaService {
  private static traktApiBaseUri = 'https://api.trakt.tv'
  private static tmdbApiBaseUri = 'https://api.themoviedb.org/3'

  static getRecommendations = async (accessToken: string) => {
    const url = '/recommendations'
    const recommendations = await TraktService.sendTraktGetRequest<
      Recommendation[]
    >(url, accessToken)
    const medias = await MediaService.fillImages(recommendations)
    return medias
  }

  static getTrending = async (accessToken: string, type: MediaType) => {
    let url = ''
    if (type === MediaType.Movie) {
      url = `/movies/trending`
    } else if (type === MediaType.Show) {
      url = `/shows/trending`
    }

    let trending = await TraktService.sendTraktGetRequest<Trending[]>(
      url,
      accessToken,
    )
    const medias = await MediaService.fillImages(trending, type)
    return medias
  }

  private static async fillImages(
    recommendations: TraktContentResponse[],
    type?: MediaType,
  ) {
    const mediasPromise: Promise<Media>[] = recommendations.map(async (r) => {
      const ids = r.movie?.ids ?? r.show!.ids
      const mediatype =
        (type ?? r.type === MediaType.Movie) ? MediaType.Movie : MediaType.Show
      const media: Media = {
        type: mediatype,
        title: r.movie?.title ?? r.show!.title,
        ids: ids,
        year: r.movie?.year ?? r.show!.year,
      }
      media.images = await TmdbService.getMediaImages(ids.tmdb, mediatype)
      return media
    })

    const medias = await Promise.all(mediasPromise)
    return medias
  }
}
