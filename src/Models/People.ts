import { z } from 'zod'
import { zIds } from './Ids'

const zCastCrewMember = z.object({
  characters: z.array(z.string()).optional(),
  jobs: z.array(z.string()).optional(),
  episode_count: z.number().optional(),
  person: z.object({
    name: z.string(),
    ids: zIds,
  }),
  images: z.object({
    headshot: z.array(z.string()),
  }),
})

export const zPeople = z.object({
  cast: z.array(zCastCrewMember),
  crew: z.object({
    directing: z.array(zCastCrewMember),
    writing: z.array(zCastCrewMember),
  }),
})

export type People = z.infer<typeof zPeople>
