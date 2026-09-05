import { z } from 'zod';

export const MONUMENT_PAGE_SIZE = 60;

export const monumentSearchSchema = z.object({
  q: z.string().min(1).max(500),
  limit: z.coerce.number().int().min(1).max(100).default(MONUMENT_PAGE_SIZE),
  offset: z.coerce.number().int().min(0).max(10000).default(0),
  ordering: z.string().optional(),
  inscription_contains: z.string().optional(),
  commentary_contains: z.string().optional(),
  poet_name_contains: z.string().optional(),
  poet_id: z.coerce.number().int().positive().optional(),
  kigo: z.string().optional(),
  season: z.string().optional(),
  material: z.string().optional(),
  monument_type: z.string().optional(),
  prefecture: z.string().optional(),
  region: z.string().optional(),
  location_id: z.coerce.number().int().positive().optional(),
  bbox: z.string().optional(),
  established_start: z.string().optional(),
  established_end: z.string().optional(),
  has_media: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  uncertain: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),
  expand: z.string().optional(),
});
