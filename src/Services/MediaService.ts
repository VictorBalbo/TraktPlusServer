import { Media, MediaType } from '../Models'
import { Recommendation, TraktContentResponse, Trending } from '../Models/Trakt'
import { TmdbService, TraktService } from '.'
export class MediaService {
  private static PAGE_SIZE = 25

  static getRecommendations = async (accessToken: string) => {
    const url = '/recommendations'
    const recommendations = await TraktService.sendTraktGetRequest<Recommendation[]>(
      url,
      accessToken,
    )
    const medias = await MediaService.fillImages(recommendations)
    return medias
  }

  static getTrending = async (accessToken: string, type: MediaType) => {
    let url = ''
    if (type === MediaType.Movie) {
      url = `/movies/trending?limit=${MediaService.PAGE_SIZE}`
    } else if (type === MediaType.Show) {
      url = `/shows/trending?limit=${MediaService.PAGE_SIZE}`
    }

    const trending = await TraktService.sendTraktGetRequest<Trending[]>(url, accessToken)
    const medias = await MediaService.fillImages(trending)
    return medias
  }

  private static async fillImages(contentResponse: TraktContentResponse[]) {
    const mediasPromise: Promise<Media>[] = contentResponse.map(async (c) => {
      let content = c.movie ?? c.show!
      let mediatype = c.movie ? MediaType.Movie : MediaType.Show

      const media: Media = {
        type: mediatype,
        title: content.title,
        ids: content.ids,
        year: content.year,
        images: await TmdbService.getMediaImages(content.ids.tmdb, mediatype),
      }
      return media
    })

    const medias = await Promise.all(mediasPromise)
    return medias
  }
}
