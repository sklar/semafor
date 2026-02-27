import { defineCollection } from 'astro:content'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema'
import { z } from 'astro/zod'

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				heroCompact: z.boolean().default(false),
			}),
		}),
	}),
	i18n: defineCollection({
		type: 'data',
		schema: i18nSchema({
			extend: z
				.object({
					'breadcrumbs.home': z.string(),
				})
				.partial(),
		}),
	}),
}
