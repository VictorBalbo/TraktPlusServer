import { z } from 'zod'

export const zScorings = z.object({
  traktScore: z.number().nullish(),
  traktVotes: z.number().nullish(),
  imdbScore: z.number().nullish(),
  imdbVotes: z.number().nullish(),
  tmdbScore: z.number().nullish(),
  jwRating: z.number().nullish(),
  tomatoMeter: z.number().nullish(),
  certifiedFresh: z.boolean().nullish(),
})

export type Scorings = z.infer<typeof zScorings>
