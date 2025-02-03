import { MovieDetails, MediaType, ShowDetails, Season } from '../Models'
import { TraktMovieDetails, TraktSeason, TraktShowDetails } from '../Models/Trakt'
import { JustWatchService, TmdbService, TraktService } from '.'

export class MediaDetailsService {
  static getMovieDetail = async (accessToken: string, id: string) => {
    let url = `/movies/${id}?extended=full`

    const movieDetails = await TraktService.sendTraktGetRequest<TraktMovieDetails>(url, accessToken)
    const watchProviders = await JustWatchService.searchMediaProviders(
      movieDetails.ids.slug ?? movieDetails.title,
      movieDetails.ids.imdb,
    )
    const images = await TmdbService.getMediaImages(MediaType.Movie, movieDetails.ids.tmdb)
    const movie: MovieDetails = {
      ...movieDetails,
      type: MediaType.Movie,
      images,
      providers: watchProviders,
    }
    return movie
  }
  static getShowDetail = async (accessToken: string, id: string) => {
    let showDetailsUrl = `/shows/${id}?extended=full`
    let showSeasonsUrl = `/shows/${id}/seasons?extended=full`

    const showDetails = await TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const showSeasons = await TraktService.sendTraktGetRequest<TraktSeason[]>(
      showSeasonsUrl,
      accessToken,
    )
    const watchProviders = await JustWatchService.searchMediaProviders(
      showDetails.ids.slug ?? showDetails.title,
      showDetails.ids.imdb,
    )

    const showImages = await TmdbService.getMediaImages(MediaType.Movie, showDetails.ids.tmdb)

    const seasons = showSeasons.map(async (s) => {
      const seasonImages = await TmdbService.getMediaImages(
        MediaType.Season,
        showDetails.ids.tmdb,
        s.number,
      )
      const season: Season = {
        ...s,
        images: seasonImages,
      }
      return season
    })

    const show: ShowDetails = {
      ...showDetails,
      type: MediaType.Movie,
      images: showImages,
      providers: watchProviders,
      seasons: await Promise.all(seasons),
    }
    return show
  }
}
