import { z } from 'zod'

export const zIds = z.object({
  trakt: z.number(),
  slug: z.string(),
  imdb: z.string().nullish(),
  tmdb: z.number(),
  justwatch: z.string().nullish(),
})

export type Ids = z.infer<typeof zIds>
