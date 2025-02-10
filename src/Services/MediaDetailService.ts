import {
  TraktEpisodeDetails,
  TraktMovieDetails,
  TraktSeasonDetails,
  TraktShowDetails,
} from '../Models/Providers/Trakt'
import { JustWatchService, TmdbService, TraktService } from '.'
import {
  Credits,
  EpisodeDetails,
  MediaImages,
  MediaType,
  MovieDetails,
  SeasonDetails,
  ShowDetails,
} from '../Models'
import { Redis } from '../Storage'
import { MovieDetailsSchema } from '../Models/MediaDetails/MovieDetails'
import { ShowDetailsSchema } from '../Models/MediaDetails/ShowDetails'
import { TmdbSeasonDetails, TmdbShowDetails } from 'src/Models/Providers/Tmdb'

export class MediaDetailsService {
  static getMovieDetail = async (accessToken: string, id: string) => {
    // const cachedMovie = await Redis.findMedia<MovieDetails>(MediaType.Movie, id)
    // if (cachedMovie) {
    //   return cachedMovie
    // }

    const url = `/movies/${id}?extended=full`
    const movieDetails = await TraktService.sendTraktGetRequest<TraktMovieDetails>(url, accessToken)

    const mediaProvidersPromise = JustWatchService.searchMediaProviders(
      movieDetails.title,
      MediaType.Movie,
      movieDetails.ids.imdb,
    )
    const peopleUrl = `/movies/${id}/people?extended=images`
    const moviePeoplePromise = TraktService.sendTraktGetRequest<Credits>(peopleUrl, accessToken)
    const imagesPromise = TmdbService.getMediaImages(MediaType.Movie, movieDetails.ids.tmdb)

    const [{ justWatchId, scorings, watchProviders }, moviePeople, images] = await Promise.all([
      mediaProvidersPromise,
      moviePeoplePromise,
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
      credits: MediaDetailsService.filterMediaPeople(moviePeople, MediaType.Movie),
    }

    const response = MovieDetailsSchema.parse(movie)
    // await Redis.saveMedia(response)
    return response
  }

  static getShowDetail = async (accessToken: string, id: string) => {
    // const cachedMovie = await Redis.findMedia<ShowDetails>(MediaType.Show, id)
    // if (cachedMovie) {
    //   return cachedMovie
    // }

    let showDetailsUrl = `/shows/${id}?extended=full`
    let showSeasonsUrl = `/shows/${id}/seasons?extended=full`
    const traktShowDetailsPromise = TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const traktSeasonsPromise = TraktService.sendTraktGetRequest<TraktSeasonDetails[]>(
      showSeasonsUrl,
      accessToken,
    )
    const [traktShowDetails, traktShowSeasons] = await Promise.all([
      traktShowDetailsPromise,
      traktSeasonsPromise,
    ])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      traktShowDetails.title,
      MediaType.Show,
      traktShowDetails.ids.imdb,
    )

    const tmdbUrl = `/tv/${traktShowDetails.ids.tmdb}?append_to_response=videos,content_ratings`
    const tmdbShowDetailsPromise = TmdbService.sendTmdbGetRequest<TmdbShowDetails>(tmdbUrl)

    const peopleUrl = `/shows/${id}/people?extended=images`
    const showPeoplePromise = TraktService.sendTraktGetRequest<Credits>(peopleUrl, accessToken)

    const [{ watchProviders, scorings, justWatchId }, showPeople, tmdbShowDetails] =
      await Promise.all([watchProviderPromise, showPeoplePromise, tmdbShowDetailsPromise])

    const showImages: MediaImages = {
      poster: tmdbShowDetails.poster_path,
      backdrop: tmdbShowDetails.backdrop_path,
    }

    const seasons = traktShowSeasons.map((s) => {
      const tmdbSeason = tmdbShowDetails.seasons.find((tmdbS) => tmdbS.id === s.ids.tmdb)
      const season: SeasonDetails = {
        ...s,
        type: MediaType.Season,
        images: {
          poster: tmdbSeason?.poster_path,
        },
      }
      return season
    })

    const show: ShowDetails = {
      ...traktShowDetails,
      type: MediaType.Show,
      images: showImages,
      released: traktShowDetails.first_aired,
      providers: watchProviders,
      seasons: seasons,
      scorings: {
        ...scorings,
        traktScore: traktShowDetails.rating,
        traktVotes: traktShowDetails.votes,
      },
      ids: {
        ...traktShowDetails.ids,
        justwatch: justWatchId,
      },
      credits: MediaDetailsService.filterMediaPeople(showPeople, MediaType.Show),
    }
    const response = ShowDetailsSchema.parse(show)
    // await Redis.saveMedia(response)
    return response
  }

  static getSeasonDetail = async (accessToken: string, id: string, seasonId: string) => {
    // const cachedMovie = await Redis.findMedia<ShowDetails>(MediaType.Show, id)
    // if (cachedMovie) {
    //   return cachedMovie
    // }

    let showDetailsUrl = `/shows/${id}?extended=full`
    const traktShowDetailsPromise = TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    let showSeasonsUrl = `/shows/${id}/seasons/${seasonId}/info?extended=full`
    const traktSeasonPromise = TraktService.sendTraktGetRequest<TraktSeasonDetails>(
      showSeasonsUrl,
      accessToken,
    )
    let seasonEpisodesUrl = `/shows/${id}/seasons/${seasonId}?extended=full`
    const traktSeasonEpisodesPromise = TraktService.sendTraktGetRequest<TraktEpisodeDetails[]>(
      seasonEpisodesUrl,
      accessToken,
    )
    const [traktShowDetails, traktShowSeason, traktSeasonEpisodes] = await Promise.all([
      traktShowDetailsPromise,
      traktSeasonPromise,
      traktSeasonEpisodesPromise,
    ])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      traktShowDetails.title,
      MediaType.Show,
      traktShowDetails.ids.imdb,
    )

    const tmdbSeasonUrl = `/tv/${traktShowDetails.ids.tmdb}/season/${seasonId}?append_to_response=videos`
    const tmdbShowSeasonPromise = TmdbService.sendTmdbGetRequest<TmdbSeasonDetails>(tmdbSeasonUrl)

    const peopleUrl = `/shows/${id}/seasons/${seasonId}/people?extended=images`
    const showPeoplePromise = TraktService.sendTraktGetRequest<Credits>(peopleUrl, accessToken)

    const [{ watchProviders, scorings, justWatchId }, tmdbShowSeason, showPeople] =
      await Promise.all([watchProviderPromise, tmdbShowSeasonPromise, showPeoplePromise])

    const episodes = traktSeasonEpisodes.map((e) => {
      const tmdbEpisode = tmdbShowSeason.episodes?.find((episode) => episode.id === e.ids.tmdb)
      const episode: EpisodeDetails = {
        ...e,
        type: MediaType.Episode,
        images: {
          still: tmdbEpisode?.still_path,
        },
      }
      return episode
    })

    const season: SeasonDetails = {
      ...traktShowSeason,
      type: MediaType.Season,
      images: {
        poster: tmdbShowSeason.poster_path,
      },
      episodes: episodes,
    }

    const show: ShowDetails = {
      ...traktShowDetails,
      type: MediaType.Show,
      released: traktShowDetails.first_aired,
      providers: watchProviders,
      seasons: [season],
      scorings: {
        ...scorings,
        traktScore: traktShowDetails.rating,
        traktVotes: traktShowDetails.votes,
      },
      ids: {
        ...traktShowDetails.ids,
        justwatch: justWatchId,
      },
      credits: MediaDetailsService.filterMediaPeople(showPeople, MediaType.Season),
    }
    const response = ShowDetailsSchema.parse(show)
    // await Redis.saveMedia(response)
    return response
  }

  private static filterMediaPeople = (credits: Credits, mediaType: MediaType) => {
    const maxCast = 15
    credits.cast = credits.cast.slice(0, maxCast)
    if (mediaType === MediaType.Show) {
      credits.crew = {
        'created by': credits.crew['created by'],
        writing: credits.crew.writing?.filter(
          (d) => d.jobs?.includes('Comic Book') || d.jobs?.includes('Story'),
        ),
      }
    } else if (mediaType === MediaType.Movie) {
      credits.crew = {
        directing: credits.crew.directing?.filter((d) => d.jobs?.includes('Director')),
        writing: credits.crew.writing?.filter(
          (d) => d.jobs?.includes('Writer') || d.jobs?.includes('Story'),
        ),
      }
    }
    return credits
  }
}
