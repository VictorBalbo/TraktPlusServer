import { Ids, IdsSchema } from './Ids'
import { Credits, CreditsSchema } from './Credits'
import { MediaImages, MediaImagesSchema } from './MediaImages'
import { Scorings, ScoringsSchema } from './Scorings'
import { WatchProvider, WatchProviderSchema } from './WatchProvider'

import { Media, MediaDetails, MediaDetailsSchema, MediaSchema, MediaType } from './Media/Media'
import { Episode, EpisodeSchema } from './Media/Episode'
import { MovieDetails, MovieDetailsSchema } from './Media/Movie'
import { Season, SeasonDetails, SeasonDetailsSchema, SeasonSchema } from './Media/Season'
import { ShowDetails, ShowDetailsSchema } from './Media/Show'

export {
  Ids,
  MediaImages,
  Credits,
  Scorings,
  WatchProvider,
  MediaType,
  Media,
  MediaDetails,
  MovieDetails,
  ShowDetails,
  Season,
  SeasonDetails,
  Episode,
}

export {
  IdsSchema,
  MediaImagesSchema,
  CreditsSchema,
  ScoringsSchema,
  WatchProviderSchema,
  MediaSchema,
  MediaDetailsSchema,
  MovieDetailsSchema,
  ShowDetailsSchema,
  SeasonSchema,
  SeasonDetailsSchema,
  EpisodeSchema,
}
