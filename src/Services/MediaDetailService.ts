import {
  TraktEpisodeDetails,
  TraktMovieDetails,
  TraktSeasonDetails,
  TraktShowDetails,
} from '../Models/Providers/Trakt'
import { JustWatchService, TmdbService, TraktService } from '.'
import {
  EpisodeDetails,
  MediaType,
  MovieDetails,
  People,
  SeasonDetails,
  ShowDetails,
} from '../Models'
import { Redis } from '../Storage'
import { zMovieDetails } from '../Models/MediaDetails/MovieDetails'
import { zShowDetails } from '../Models/MediaDetails/ShowDetails'

export class MediaDetailsService {
  static getMovieDetail = async (accessToken: string, id: string) => {
    const cachedMovie = await Redis.findMedia<MovieDetails>(MediaType.Movie, id)
    if (cachedMovie) {
      return cachedMovie
    }

    const url = `/movies/${id}?extended=full`
    const movieDetails = await TraktService.sendTraktGetRequest<TraktMovieDetails>(url, accessToken)

    const mediaProvidersPromise = JustWatchService.searchMediaProviders(
      movieDetails.title,
      MediaType.Movie,
      movieDetails.ids.imdb,
    )
    const peopleUrl = `/movies/${id}/people?extended=images`
    const moviePeoplePromise = TraktService.sendTraktGetRequest<People>(peopleUrl, accessToken)
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
      people: MediaDetailsService.filterMediaPeople(moviePeople),
    }

    const response = zMovieDetails.parse(movie)
    await Redis.saveMedia(response)
    return response
  }

  static getShowDetail = async (accessToken: string, id: string) => {
    const cachedMovie = await Redis.findMedia<ShowDetails>(MediaType.Show, id)
    if (cachedMovie) {
      return cachedMovie
    }

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
      showDetails.title,
      MediaType.Show,
      showDetails.ids.imdb,
    )

    const peopleUrl = `/shows/${id}/people?extended=images`
    const showPeoplePromise = TraktService.sendTraktGetRequest<People>(peopleUrl, accessToken)

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

    const [{ watchProviders, scorings, justWatchId }, showPeople, showImages, ...seasons] =
      await Promise.all([
        watchProviderPromise,
        showPeoplePromise,
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
      people: MediaDetailsService.filterMediaPeople(showPeople),
    }
    const response = zShowDetails.parse(show)
    await Redis.saveMedia(response)
    return response
  }

  static getSeasonDetail = async (accessToken: string, id: string, seasonId: string) => {
    const showDetailsUrl = `/shows/${id}`
    const showSeasonsUrl = `/shows/${id}/seasons/${seasonId}/info?extended=full`
    const episodesDetailsUrl = `/shows/${id}/seasons/${seasonId}?extended=full`
    const peopleUrl = `/shows/${id}/seasons/${seasonId}/people?extended=images`

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
    const seasonPeoplePromise = TraktService.sendTraktGetRequest<People>(peopleUrl, accessToken)
    const [showDetails, showSeasons, episodesDetails, seasonPeople] = await Promise.all([
      showDetailsPromise,
      showSeasonsPromise,
      episodesDetailsPromise,
      seasonPeoplePromise,
    ])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      showDetails.title,
      MediaType.Show,
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
      ids: {
        ...showDetails.ids,
        justwatch: justWatchId,
      },
      people: MediaDetailsService.filterMediaPeople(seasonPeople),
    }
    const response = zShowDetails.parse(show)
    return response
  }

  static getEpisodeDetail = async (
    accessToken: string,
    id: string,
    seasonId: string,
    episodeId: string,
  ) => {
    const showDetailsUrl = `/shows/${id}`
    const episodesDetailsUrl = `/shows/${id}/seasons/${seasonId}/episodes/${episodeId}?extended=full`
    const peopleUrl = `/shows/${id}/seasons/${seasonId}/episodes/${episodeId}/people?extended=images`

    const showDetailsPromise = TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    const episodesDetailsPromise = TraktService.sendTraktGetRequest<TraktEpisodeDetails>(
      episodesDetailsUrl,
      accessToken,
    )
    const episodePeoplePromise = TraktService.sendTraktGetRequest<People>(peopleUrl, accessToken)
    const [showDetails, episodesDetails, episodePeople] = await Promise.all([
      showDetailsPromise,
      episodesDetailsPromise,
      episodePeoplePromise,
    ])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      showDetails.title,
      MediaType.Show,
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
      ids: {
        ...showDetails.ids,
        justwatch: justWatchId,
      },
      people: MediaDetailsService.filterMediaPeople(episodePeople),
    }
    const response = zShowDetails.parse(show)
    return response
  }

  private static filterMediaPeople = (people: People) => {
    const maxCast = 15
    people.cast = people.cast.slice(0, maxCast)
    if (people.crew['created by']) {
      people.crew = {
        'created by': people.crew['created by'],
      }
    } else {
      people.crew = {
        directing: people.crew.directing?.filter((d) => d.jobs?.includes('Director')),
        writing: people.crew.writing?.filter(
          (d) => d.jobs?.includes('Writer') || d.jobs?.includes('Story'),
        ),
      }
    }
    return people
  }
}
