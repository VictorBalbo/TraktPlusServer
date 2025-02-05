import {
  TraktEpisodeDetails,
  TraktMovieDetails,
  TraktSeasonDetails,
  TraktShowDetails,
} from '../Models/Providers/Trakt'
import { JustWatchService, TmdbService, TraktService } from '.'
import { EpisodeDetails, MediaType, MovieDetails, SeasonDetails, ShowDetails } from '../Models'

export class MediaDetailsService {
  static getMovieDetail = async (accessToken: string, id: string) => {
    let url = `/movies/${id}?extended=full`

    const movieDetails = await TraktService.sendTraktGetRequest<TraktMovieDetails>(url, accessToken)
    const mediaProvidersPromise = JustWatchService.searchMediaProviders(
      movieDetails.ids.slug ?? movieDetails.title,
      movieDetails.ids.imdb,
    )
    const imagesPromise = TmdbService.getMediaImages(MediaType.Movie, movieDetails.ids.tmdb)

    const [{ justWatchId, scorings, watchProviders }, images] = await Promise.all([
      mediaProvidersPromise,
      imagesPromise,
    ])

    const movie: MovieDetails = {
      ...movieDetails,
      type: MediaType.Movie,
      images,
      providers: watchProviders,
      scorings: {
        ...scorings,
        traktScore: movieDetails.rating,
        traktVotes: movieDetails.votes,
      },
      ids: {
        ...movieDetails.ids,
        justwatch: justWatchId,
      },
    }
    return movie
  }

  static getShowDetail = async (accessToken: string, id: string) => {
    let showDetailsUrl = `/shows/${id}?extended=full`
    let showSeasonsUrl = `/shows/${id}/seasons?extended=full`

    const showDetailsPrimise = TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const showSeasonsPromise = TraktService.sendTraktGetRequest<TraktSeasonDetails[]>(
      showSeasonsUrl,
      accessToken,
    )
    const [showDetails, showSeasons] = await Promise.all([showDetailsPrimise, showSeasonsPromise])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      showDetails.ids.slug ?? showDetails.title,
      showDetails.ids.imdb,
    )

    const showImagesPromise = TmdbService.getMediaImages(MediaType.Show, showDetails.ids.tmdb)
    const seasonsPromise = showSeasons.map(async (s) => {
      const seasonImages = await TmdbService.getMediaImages(
        MediaType.Season,
        showDetails.ids.tmdb,
        s.number,
      )
      const season: SeasonDetails = {
        ...s,
        type: MediaType.Season,
        images: seasonImages,
      }
      return season
    })

    const [{ watchProviders, scorings, justWatchId }, showImages, ...seasons] = await Promise.all([
      watchProviderPromise,
      showImagesPromise,
      ...seasonsPromise,
    ])

    const show: ShowDetails = {
      ...showDetails,
      type: MediaType.Show,
      images: showImages,
      providers: watchProviders,
      seasons: seasons,
      scorings: {
        ...scorings,
        traktScore: showDetails.rating,
        traktVotes: showDetails.votes,
      },
      ids: {
        ...showDetails.ids,
        justwatch: justWatchId,
      },
    }
    return show
  }

  static getSeasonDetail = async (accessToken: string, id: string, seasonId: string) => {
    let showDetailsUrl = `/shows/${id}`
    let showSeasonsUrl = `/shows/${id}/seasons/${seasonId}/info?extended=full`
    let episodesDetailsUrl = `/shows/${id}/seasons/${seasonId}?extended=full`

    const showDetailsPromise = TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const showSeasonsPromise = TraktService.sendTraktGetRequest<TraktSeasonDetails>(
      showSeasonsUrl,
      accessToken,
    )
    const episodesDetailsPromise = TraktService.sendTraktGetRequest<TraktEpisodeDetails[]>(
      episodesDetailsUrl,
      accessToken,
    )
    const [showDetails, showSeasons, episodesDetails] = await Promise.all([
      showDetailsPromise,
      showSeasonsPromise,
      episodesDetailsPromise,
    ])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      showDetails.ids.slug ?? showDetails.title,
      showDetails.ids.imdb,
    )

    const showImagesPromise = TmdbService.getMediaImages(MediaType.Show, showDetails.ids.tmdb)
    const seasonImagesPromise = TmdbService.getMediaImages(
      MediaType.Season,
      showDetails.ids.tmdb,
      showSeasons.number,
    )
    const episodesPromise = episodesDetails.map(async (e) => {
      const episodeImages = await TmdbService.getMediaImages(
        MediaType.Episode,
        showDetails.ids.tmdb,
        e.season,
        e.number,
      )
      const episode: EpisodeDetails = {
        ...e,
        type: MediaType.Season,
        show: showDetails.title,
        images: episodeImages,
      }
      return episode
    })
    const [{ watchProviders, scorings, justWatchId }, showImages, seasonImages, ...episodes] =
      await Promise.all([
        watchProviderPromise,
        showImagesPromise,
        seasonImagesPromise,
        ...episodesPromise,
      ])

    const season: SeasonDetails = {
      ...showSeasons,
      type: MediaType.Season,
      images: seasonImages,
      episodes: episodes,
    }
    const show: ShowDetails = {
      ...showDetails,
      type: MediaType.Show,
      images: showImages,
      providers: watchProviders,
      seasons: [season],
      scorings: {
        ...scorings,
        traktScore: showDetails.rating,
        traktVotes: showDetails.votes,
      },
    }
    show.ids.justwatch = justWatchId
    return show
  }

  static getEpisodeDetail = async (
    accessToken: string,
    id: string,
    seasonId: string,
    episodeId: string,
  ) => {
    let showDetailsUrl = `/shows/${id}`
    let episodesDetailsUrl = `/shows/${id}/seasons/${seasonId}/episodes/${episodeId}?extended=full`

    const showDetailsPromise = TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const episodesDetailsPromise = TraktService.sendTraktGetRequest<TraktEpisodeDetails>(
      episodesDetailsUrl,
      accessToken,
    )
    const [showDetails, episodesDetails] = await Promise.all([
      showDetailsPromise,
      episodesDetailsPromise,
    ])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      showDetails.ids.slug ?? showDetails.title,
      showDetails.ids.imdb,
    )

    const showImagesPromise = TmdbService.getMediaImages(MediaType.Show, showDetails.ids.tmdb)
    const episodeImagesPromise = TmdbService.getMediaImages(
      MediaType.Episode,
      showDetails.ids.tmdb,
      episodesDetails.season,
      episodesDetails.number,
    )
    const [{ watchProviders, scorings, justWatchId }, showImages, episodeImages] =
      await Promise.all([watchProviderPromise, showImagesPromise, episodeImagesPromise])

    const episode: EpisodeDetails = {
      ...episodesDetails,
      type: MediaType.Season,
      show: showDetails.title,
      images: episodeImages,
    }
    const season: SeasonDetails = {
      type: MediaType.Season,
      number: episode.season,
      episodes: [episode],
      title: `Season ${episode.season}`,
      ids: episode.ids,
    }
    const show: ShowDetails = {
      ...showDetails,
      type: MediaType.Show,
      images: showImages,
      providers: watchProviders,
      seasons: [season],
      scorings: {
        ...scorings,
        traktScore: showDetails.rating,
        traktVotes: showDetails.votes,
      },
    }
    show.ids.justwatch = justWatchId
    return show
  }
}
