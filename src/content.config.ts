import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { stages } from './lib/architecture';

const safeUrl = z.url({ protocol: /^https?$/ });
const localImage = z.string().regex(/^[\w-]+(?:\/[\w-]+)*\.[\w]+$/);

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().min(1),
    summary: z.string().min(1),
    category: z.string().min(1),
    tags: z.array(z.string()).default([]),
    stages: z.array(z.enum(stages.map(({ id }) => id))).default([]),
    kind: z.enum(['project', 'reference']).default('project'),
    order: z.number().int().default(100),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    image: z.object({
      path: localImage,
      alt: z.string(),
      width: z.number().int().positive(),
      height: z.number().int().positive()
    }).optional(),
    repository: safeUrl.optional(),
    demo: safeUrl.optional()
  })
});

export const collections = { projects };
