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
    const { watchProviders, scorings, justWatchId } = await JustWatchService.searchMediaProviders(
      movieDetails.ids.slug ?? movieDetails.title,
      movieDetails.ids.imdb,
    )
    const images = await TmdbService.getMediaImages(MediaType.Movie, movieDetails.ids.tmdb)
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
    }
    movie.ids.justwatch = justWatchId
    return movie
  }

  static getShowDetail = async (accessToken: string, id: string) => {
    let showDetailsUrl = `/shows/${id}?extended=full`
    let showSeasonsUrl = `/shows/${id}/seasons?extended=full`

    const showDetails = await TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const showSeasons = await TraktService.sendTraktGetRequest<TraktSeasonDetails[]>(
      showSeasonsUrl,
      accessToken,
    )
    const { watchProviders, scorings, justWatchId } = await JustWatchService.searchMediaProviders(
      showDetails.ids.slug ?? showDetails.title,
      showDetails.ids.imdb,
    )

    const showImages = await TmdbService.getMediaImages(MediaType.Show, showDetails.ids.tmdb)
    const seasons = showSeasons.map(async (s) => {
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

    const show: ShowDetails = {
      ...showDetails,
      type: MediaType.Show,
      images: showImages,
      providers: watchProviders,
      seasons: await Promise.all(seasons),
      scorings: {
        ...scorings,
        traktScore: showDetails.rating,
        traktVotes: showDetails.votes,
      },
    }
    show.ids.justwatch = justWatchId
    return show
  }

  static getSeasonDetail = async (accessToken: string, id: string, seasonId: string) => {
    let showDetailsUrl = `/shows/${id}`
    let showSeasonsUrl = `/shows/${id}/seasons/${seasonId}/info?extended=full`
    let episodesDetailsUrl = `/shows/${id}/seasons/${seasonId}?extended=full`

    const showDetails = await TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const showSeasons = await TraktService.sendTraktGetRequest<TraktSeasonDetails>(
      showSeasonsUrl,
      accessToken,
    )
    const episodesDetails = await TraktService.sendTraktGetRequest<TraktEpisodeDetails[]>(
      episodesDetailsUrl,
      accessToken,
    )
    const { watchProviders, scorings, justWatchId } = await JustWatchService.searchMediaProviders(
      showDetails.ids.slug ?? showDetails.title,
      showDetails.ids.imdb,
    )

    const showImages = await TmdbService.getMediaImages(MediaType.Show, showDetails.ids.tmdb)
    const seasonImages = await TmdbService.getMediaImages(
      MediaType.Season,
      showDetails.ids.tmdb,
      showSeasons.number,
    )
    const episodes = episodesDetails.map(async (e) => {
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
    const season: SeasonDetails = {
      ...showSeasons,
      type: MediaType.Season,
      images: seasonImages,
      episodes: await Promise.all(episodes),
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

    const showDetails = await TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const episodesDetails = await TraktService.sendTraktGetRequest<TraktEpisodeDetails>(
      episodesDetailsUrl,
      accessToken,
    )
    const { watchProviders, scorings, justWatchId } = await JustWatchService.searchMediaProviders(
      showDetails.ids.slug ?? showDetails.title,
      showDetails.ids.imdb,
    )

    const showImages = await TmdbService.getMediaImages(MediaType.Show, showDetails.ids.tmdb)
    const episodeImages = await TmdbService.getMediaImages(
      MediaType.Episode,
      showDetails.ids.tmdb,
      episodesDetails.season,
      episodesDetails.number,
    )
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
