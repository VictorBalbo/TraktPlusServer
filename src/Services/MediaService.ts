import { Media } from "@/Models"
import { Recommendation } from "@/Models/Trakt"
import { MediaType } from "@/Models/Media"
import { TraktService } from "./TraktService"
import { TmdbService } from "./TmdbService"

export class MediaService {
  private static traktApiBaseUri = 'https://api.trakt.tv'
  private static tmdbApiBaseUri = 'https://api.themoviedb.org/3'

  static getRecommendations = async (accessToken: string) => {
    const url = '/recommendations'
    const recommendations = await TraktService.sendTraktGetRequest<Recommendation[]>(url, accessToken)

    const mediasPromise: Promise<Media>[] = recommendations.map(async (r) => {
      const ids = r.movie?.ids ?? r.show!.ids
      const mediatype = r.type === MediaType.Movie ? MediaType.Movie : MediaType.Show
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