import {
  Recommendation,
  ShowProgress,
  TraktContentResponse,
  Trending,
  WatchedShow,
  WatchList,
} from '../Models/Providers/Trakt'
import { EpisodeDetails, Media, MediaType } from '../Models'
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

  static getUpNextShows = async (accessToken: string) => {
    const watchedShowsUrl = '/sync/watched/shows'
    const showProgressUrl = '/shows/{id}/progress/watched'
    const watchedShows = await TraktService.sendTraktGetRequest<WatchedShow[]>(
      watchedShowsUrl,
      accessToken,
    )

    const upNextPromise = watchedShows.map(async (s: WatchedShow) => {
      const showProgress = await TraktService.sendTraktGetRequest<ShowProgress>(
        showProgressUrl.replace('{id}', s.show.ids.trakt.toString()),
        accessToken,
      )
      const nextEpisode = showProgress.next_episode
      if (!nextEpisode) {
        return
      }
      const episode: EpisodeDetails = {
        type: MediaType.Episode,
        title: nextEpisode.title,
        ids: nextEpisode.ids,
        number: nextEpisode.number,
        season: nextEpisode.season,
        show: s.show.title,
        year: s.show.year,
        images: await TmdbService.getMediaImages(
          MediaType.Episode,
          s.show.ids.tmdb,
          nextEpisode.season,
          nextEpisode.number,
        ),
      }
      return episode
    })

    const upNext = await Promise.all(upNextPromise)
    return upNext.filter((s) => s)
  }

  static getWatchlist = async (accessToken: string) => {
    let url = '/sync/watchlist'

    const watchlist = await TraktService.sendTraktGetRequest<WatchList[]>(url, accessToken)
    const medias = await MediaService.fillImages(watchlist)
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
        images: await TmdbService.getMediaImages(mediatype, content.ids.tmdb),
      }
      return media
    })

    const medias = await Promise.all(mediasPromise)
    return medias
  }
}
