import { z } from 'zod'

export const MediaImagesSchema = z.object({
  backdrop: z.string().nullish(),
  poster: z.string().nullish(),
  still: z.string().nullish(),
})

export type MediaImages = z.infer<typeof MediaImagesSchema>
