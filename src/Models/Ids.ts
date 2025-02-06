import { z } from 'zod'

export const zIds = z.object({
  trakt: z.number(),
  slug: z.string().optional(),
  imdb: z.string().nullish(),
  tmdb: z.number().nullish().transform((value) => value ?? undefined),
  justwatch: z.string().nullish(),
})

export type Ids = z.infer<typeof zIds>
