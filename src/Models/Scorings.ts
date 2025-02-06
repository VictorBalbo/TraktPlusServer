import { z } from 'zod'

export const zScorings = z.object({
  traktScore: z.number().optional(),
  traktVotes: z.number().optional(),
  imdbScore: z.number().optional(),
  imdbVotes: z.number().optional(),
  tmdbScore: z.number().optional(),
  jwRating: z.number().optional(),
  tomatoMeter: z.number().nullish(),
  certifiedFresh: z.boolean().nullish(),
})

export type Scorings = z.infer<typeof zScorings>
