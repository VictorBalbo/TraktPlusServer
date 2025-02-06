import { z } from 'zod'

export const zImages = z.object({
  aspect_ratio: z.number(),
  height: z.number(),
  width: z.number(),
  iso_639_1: z.string(),
  file_path: z.string(),
  base_path: z.string().default('https://image.tmdb.org/t/p'),
  sizes: z.array(z.string()),
})

export const zMediaImages = z.object({
  backdrops: zImages.optional(),
  logos: zImages.optional(),
  posters: zImages.optional(),
  stills: zImages.optional(),
})

export type Image = z.infer<typeof zImages>
export type MediaImages = z.infer<typeof zMediaImages>
