import {
  TraktEpisodeDetails,
  TraktMovieDetails,
  TraktSeasonDetails,
  TraktShowDetails,
} from '../Models/Providers/Trakt'
import { JustWatchService, TmdbService, TraktService } from '.'
import {
  Episode,
  Credits,
  MediaType,
  MovieDetails,
  Season,
  ShowDetails,
  SeasonDetails,
  SeasonDetailsSchema,
  Trailer,
  EpisodeDetails,
} from '../Models'
import { MovieDetailsSchema, ShowDetailsSchema, EpisodeDetailsSchema } from '../Models'
import {
  TmdbEpisodeDetails,
  TmdbMovieDetails,
  TmdbSeasonDetails,
  TmdbShowDetails,
  TmdbVideos,
} from '../Models/Providers/Tmdb'

export class MediaDetailsService {
  static getMovieDetail = async (accessToken: string, id: string) => {
    // const cachedMovie = await Redis.findMedia<MovieDetails>(MediaType.Movie, id)
    // if (cachedMovie) {
    //   return cachedMovie
    // }

    const url = `/movies/${id}?extended=full`
    const traktMovie = await TraktService.sendTraktGetRequest<TraktMovieDetails>(url, accessToken)

    const mediaProvidersPromise = JustWatchService.searchMediaProviders(
      traktMovie.title,
      MediaType.Movie,
      traktMovie.ids.imdb,
    )
    const peopleUrl = `/movies/${id}/people?extended=images`
    const moviePeoplePromise = TraktService.sendTraktGetRequest<Credits>(peopleUrl, accessToken)

    const tmdbUrl = `/movie/${traktMovie.ids.tmdb}?append_to_response=videos,release_dates`
    const tmdbMoviePromise = TmdbService.sendTmdbGetRequest<TmdbMovieDetails>(tmdbUrl)

    const [{ justWatchId, scorings, watchProviders }, moviePeople, tmdbMovie] = await Promise.all([
      mediaProvidersPromise,
      moviePeoplePromise,
      tmdbMoviePromise,
    ])

    const movie: MovieDetails = {
      ...tmdbMovie,
      type: MediaType.Movie,
      released: tmdbMovie.release_date,
      images: {
        backdrop: tmdbMovie.backdrop_path,
        poster: tmdbMovie.poster_path,
      },
      genres: tmdbMovie.genres?.map((g) => g.name),
      language: tmdbMovie.original_language,
      providers: watchProviders,
      country: tmdbMovie.origin_country.join(', '),
      scorings: {
        ...scorings,
        traktScore: traktMovie.rating,
        traktVotes: traktMovie.votes,
      },
      ids: {
        ...traktMovie.ids,
        justwatch: justWatchId,
      },
      certification: tmdbMovie.release_dates.results
        .find((r) => r.iso_3166_1 === 'BR')
        ?.release_dates.find((r) => r.certification)?.certification,
      credits: MediaDetailsService.filterMediaPeople(moviePeople, MediaType.Movie),
      trailers: this.getTrailerVideos(tmdbMovie.videos),
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
    const traktShow = await TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      traktShow.title,
      MediaType.Show,
      traktShow.ids.imdb,
    )

    const tmdbUrl = `/tv/${traktShow.ids.tmdb}?append_to_response=videos,content_ratings`
    const tmdbShowDetailsPromise = TmdbService.sendTmdbGetRequest<TmdbShowDetails>(tmdbUrl)

    const peopleUrl = `/shows/${id}/people?extended=images`
    const showPeoplePromise = TraktService.sendTraktGetRequest<Credits>(peopleUrl, accessToken)

    const [{ watchProviders, scorings, justWatchId }, showPeople, tmdbShow] = await Promise.all([
      watchProviderPromise,
      showPeoplePromise,
      tmdbShowDetailsPromise,
    ])

    let showAiredEpisodes = 0
    const lastEpisodeToAir = tmdbShow.last_episode_to_air
    const seasons = tmdbShow.seasons.map((s) => {
      let airedEpisodes
      if (s.season_number > 0 && s.season_number < lastEpisodeToAir.season_number) {
        airedEpisodes = s.episode_count
      } else if (s.season_number > 0 && s.season_number === lastEpisodeToAir.season_number) {
        airedEpisodes = lastEpisodeToAir.episode_number
      } else {
        airedEpisodes = 0
      }
      showAiredEpisodes += airedEpisodes ?? 0
      const season: Season = {
        ...s,
        type: MediaType.Season,
        ids: { trakt: 0 },
        title: s.name,
        number: s.season_number,
        showId: traktShow.ids.trakt,
        aired_episodes: airedEpisodes,
        images: {
          poster: s?.poster_path,
        },
      }
      return season
    })

    const show: ShowDetails = {
      ...tmdbShow,
      title: tmdbShow.name,
      type: MediaType.Show,
      images: {
        poster: tmdbShow.poster_path,
        backdrop: tmdbShow.backdrop_path,
      },
      released: tmdbShow.first_air_date,
      genres: tmdbShow.genres?.map((g) => g.name),
      providers: watchProviders,
      seasons: seasons,
      scorings: {
        ...scorings,
        traktScore: traktShow.rating,
        traktVotes: traktShow.votes,
      },
      ids: {
        ...traktShow.ids,
        justwatch: justWatchId,
      },
      credits: MediaDetailsService.filterMediaPeople(showPeople, MediaType.Show),
      certification: tmdbShow.content_ratings.results.find((r) => r.iso_3166_1 === 'BR')?.rating,
      trailers: this.getTrailerVideos(tmdbShow.videos),
      network: tmdbShow.networks?.[0]?.name,
      country: tmdbShow.origin_country?.[0],
      aired_episodes: showAiredEpisodes,
      episodes: tmdbShow.number_of_episodes,
    }
    const response = ShowDetailsSchema.parse(show)
    // await Redis.saveMedia(response)
    return response
  }

  static getSeasonDetail = async (accessToken: string, showId: string, seasonId: string) => {
    // const cachedMovie = await Redis.findMedia<ShowDetails>(MediaType.Show, id)
    // if (cachedMovie) {
    //   return cachedMovie
    // }

    let showDetailsUrl = `/shows/${showId}`
    const traktShowDetailsPromise = TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    let showSeasonsUrl = `/shows/${showId}/seasons/${seasonId}/info?extended=full`
    const traktSeasonPromise = TraktService.sendTraktGetRequest<TraktSeasonDetails>(
      showSeasonsUrl,
      accessToken,
    )
    const [traktShow, traktSeason] = await Promise.all([
      traktShowDetailsPromise,
      traktSeasonPromise,
    ])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      traktShow.title,
      MediaType.Show,
      traktShow.ids.imdb,
    )

    const tmdbShowUrl = `/tv/${traktShow.ids.tmdb}?append_to_response=content_ratings`
    const tmdbShowPromise = TmdbService.sendTmdbGetRequest<TmdbShowDetails>(tmdbShowUrl)

    const tmdbSeasonUrl = `/tv/${traktShow.ids.tmdb}/season/${seasonId}?append_to_response=videos`
    const tmdbShowSeasonPromise = TmdbService.sendTmdbGetRequest<TmdbSeasonDetails>(tmdbSeasonUrl)

    const peopleUrl = `/shows/${showId}/seasons/${seasonId}/people?extended=images`
    const seasonPeoplePromise = TraktService.sendTraktGetRequest<Credits>(peopleUrl, accessToken)

    const [{ watchProviders, scorings, justWatchId }, tmdbShow, tmdbShowSeason, seasonPeople] =
      await Promise.all([
        watchProviderPromise,
        tmdbShowPromise,
        tmdbShowSeasonPromise,
        seasonPeoplePromise,
      ])

    let seasonRuntime = 0
    const episodes = tmdbShowSeason.episodes?.map((e) => {
      seasonRuntime += e.runtime ?? 0
      const episode: Episode = {
        ...e,
        ids: { trakt: 0 },
        type: MediaType.Episode,
        title: e.name,
        number: e.episode_number,
        seasonNumber: e.season_number,
        showId: traktShow.ids.trakt,
        images: {
          still: e.still_path,
        },
      }
      return episode
    })

    const season: SeasonDetails = {
      ...tmdbShowSeason,
      type: MediaType.Season,
      title: tmdbShowSeason.name,
      number: tmdbShowSeason.season_number,
      trailers: this.getTrailerVideos(tmdbShowSeason.videos),
      show: { ...traktShow, type: MediaType.Show },
      released: tmdbShowSeason.air_date,
      providers: watchProviders,
      ids: {
        ...traktSeason.ids,
        justwatch: justWatchId,
      },
      images: {
        poster: tmdbShowSeason.poster_path,
        backdrop: tmdbShow.backdrop_path,
      },
      scorings: {
        ...scorings,
        traktScore: traktSeason.rating,
        traktVotes: traktSeason.votes,
        tmdbScore: tmdbShowSeason.vote_average,
      },
      runtime: seasonRuntime,
      certification: tmdbShow.content_ratings.results.find((r) => r.iso_3166_1 === 'BR')?.rating,
      episodes: episodes,
      episode_count: episodes?.length,
      credits: MediaDetailsService.filterMediaPeople(seasonPeople, MediaType.Season),
    }

    const response = SeasonDetailsSchema.parse(season) as SeasonDetails
    // await Redis.saveMedia(response)
    return response
  }

  static getEpisodeDetail = async (
    accessToken: string,
    showId: string,
    seasonId: string,
    episodeId: string,
  ) => {
    // const cachedMovie = await Redis.findMedia<ShowDetails>(MediaType.Show, id)
    // if (cachedMovie) {
    //   return cachedMovie
    // }

    let showDetailsUrl = `/shows/${showId}`
    const traktShowDetailsPromise = TraktService.sendTraktGetRequest<TraktShowDetails>(
      showDetailsUrl,
      accessToken,
    )
    let seasonEpisodeUrl = `/shows/${showId}/seasons/${seasonId}/episodes/${episodeId}?extended=full`
    const traktEpisodePromise = TraktService.sendTraktGetRequest<TraktEpisodeDetails>(
      seasonEpisodeUrl,
      accessToken,
    )
    const [traktShow, traktEpisode] = await Promise.all([
      traktShowDetailsPromise,
      traktEpisodePromise,
    ])

    const watchProviderPromise = JustWatchService.searchMediaProviders(
      traktShow.title,
      MediaType.Show,
      traktShow.ids.imdb,
    )

    const tmdbSeasonUrl = `/tv/${traktShow.ids.tmdb}/season/${seasonId}`
    const tmdbSeasonPromise = TmdbService.sendTmdbGetRequest<TmdbSeasonDetails>(tmdbSeasonUrl)

    const tmdbEpisodeUrl = `/tv/${traktShow.ids.tmdb}/season/${seasonId}/episode/${episodeId}?append_to_response=videos`
    const tmdbEpisodePromise = TmdbService.sendTmdbGetRequest<TmdbEpisodeDetails>(tmdbEpisodeUrl)

    const peopleUrl = `/shows/${showId}/seasons/${seasonId}/episodes/${episodeId}/people?extended=images`
    const seasonPeoplePromise = TraktService.sendTraktGetRequest<Credits>(peopleUrl, accessToken)

    const [{ watchProviders }, tmdbSeason, tmdbEpisode, seasonPeople] = await Promise.all([
      watchProviderPromise,
      tmdbSeasonPromise,
      tmdbEpisodePromise,
      seasonPeoplePromise,
    ])

    const episode: EpisodeDetails = {
      ...tmdbEpisode,
      type: MediaType.Episode,
      title: tmdbEpisode.name,
      ids: traktEpisode.ids,
      images: { backdrop: tmdbEpisode.still_path, poster: tmdbSeason.poster_path },
      number: tmdbEpisode.episode_number,
      episode_type: tmdbEpisode.episode_type,
      released: tmdbEpisode.air_date,
      providers: watchProviders,
      scorings: {
        traktScore: traktEpisode.rating,
        traktVotes: traktEpisode.votes,
        tmdbScore: tmdbEpisode.vote_average,
      },
      credits: MediaDetailsService.filterMediaPeople(seasonPeople, MediaType.Episode),
      trailers: this.getTrailerVideos(tmdbEpisode.videos, MediaType.Episode),
      show: {
        type: MediaType.Show,
        title: traktShow.title,
        ids: traktShow.ids,
      },
      seasonNumber: tmdbSeason.season_number,
      seasonTitle: tmdbSeason.name,
    }

    const response = EpisodeDetailsSchema.parse(episode) as EpisodeDetails
    // await Redis.saveMedia(response)
    return response
  }

  private static filterMediaPeople = (credits: Credits, mediaType: MediaType) => {
    const maxCast = 15
    credits.cast = credits.cast.slice(0, maxCast)
    if (mediaType === MediaType.Movie) {
      credits.crew = {
        directing: credits.crew.directing?.filter((d) => d.jobs?.includes('Director')),
        writing: credits.crew.writing?.filter(
          (d) => d.jobs?.some(j => j === 'Comic Book' || j === 'Writer' || j === 'Story'),
        ),
      }
    } else if (mediaType === MediaType.Show) {
      credits.crew = {
        'created by': credits.crew['created by'],
        writing: credits.crew.writing?.filter(
          (d) => d.jobs?.some(j => j === 'Comic Book' || j === 'Story'),
        ),
      }
    } else if (mediaType === MediaType.Season) {
      credits.crew = {
        'created by': credits.crew['created by'],
        directing: credits.crew.directing?.filter((d) => d.jobs?.includes('Director')),
        writing: credits.crew.writing?.filter(
          (d) => d.jobs?.some(j => j === 'Comic Book' || j === 'Story'),
        ),
      }
    } else {
      credits.crew = {
        'created by': credits.crew['created by'],
        directing: credits.crew.directing?.filter((d) => d.jobs?.includes('Director')),
        writing: credits.crew.writing?.filter(
          (d) => d.jobs?.some(j => j === 'Comic Book' || j === 'Writer' || j === 'Story'),
        ),
      }
    }
    return credits
  }

  private static getTrailerVideos = (videos?: TmdbVideos, mediaType?: MediaType) => {
    return videos?.results
      .filter((v) => v.site === 'YouTube' && v.official === true && v.type === 'Trailer')
      .map((v) => {
        const trailer: Trailer = {
          ...v,
          url: `https://www.youtube.com/watch?v=${v.key}`,
        }
        return trailer
      })
  }
}
