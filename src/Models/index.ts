import { Ids, IdsSchema } from './Ids'
import { Scorings, ScoringsSchema } from './Scorings'
import { Credits, CreditsSchema } from './Credits'
import { MediaImages, MediaImagesSchema } from './MediaImages'
import { WatchProvider, WatchProviderSchema } from './WatchProvider'

import { Media, MediaSchema, MediaType } from './Media'
import { MediaDetailsSchema } from './MediaDetails/MediaDetails'
import { EpisodeDetails } from './MediaDetails/EpisodeDetails'
import { SeasonDetails } from './MediaDetails/SeasonDetails'
import { ShowDetails, ShowDetailsSchema } from './MediaDetails/ShowDetails'
import { MovieDetails, MovieDetailsSchema } from './MediaDetails/MovieDetails'

export { Ids, Media, MediaImages, MediaType, Credits, Scorings, WatchProvider }

export { MovieDetails, ShowDetails, SeasonDetails, EpisodeDetails }

// Export schemas
export {
  ScoringsSchema,
  MediaSchema,
  MediaDetailsSchema,
  ShowDetailsSchema,
  MovieDetailsSchema,
  WatchProviderSchema,
  IdsSchema,
  MediaImagesSchema,
  CreditsSchema,
}
