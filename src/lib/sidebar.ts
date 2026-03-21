import { sidebar } from '@/sidebar.config'

type SidebarEntry = NonNullable<typeof sidebar>[number]
type SidebarObject = Exclude<SidebarEntry, string>

function isObject(entry: SidebarEntry): entry is SidebarObject {
	return typeof entry !== 'string'
}

function findGroupBySlug(
	items: SidebarEntry[],
	slug: string,
): SidebarObject | undefined {
	for (const item of items) {
		if (!isObject(item)) continue
		if ('slug' in item && item.slug === slug) return undefined
		if ('items' in item && item.items) {
			for (const child of item.items) {
				if (isObject(child) && 'slug' in child && child.slug === slug)
					return item
			}
			const found = findGroupBySlug(item.items, slug)
			if (found) return found
		}
	}
	return undefined
}

/**
 * Return topic directory slugs for a sidebar sub-area.
 * Extracts the last path segment from each `autogenerate.directory` entry.
 *
 * @param subAreaSlug - Slug identifying the sub-area group in the sidebar config
 * @returns Array of topic directory slugs
 *
 * @example
 * getSubAreaSlugs('matematika')
 * // => ['01-pocetni-operace', '02-zaokrouhlovani-a-odhady', ...]
 */
export function getSubAreaSlugs(subAreaSlug: string): string[] {
	const group = findGroupBySlug(sidebar ?? [], subAreaSlug)
	if (!group || !('items' in group) || !group.items) return []

	const slugs: string[] = []

	for (const item of group.items) {
		if (!isObject(item)) continue
		if ('autogenerate' in item && item.autogenerate) {
			const dir = item.autogenerate.directory
			const lastSegment = dir.split('/').at(-1)
			if (lastSegment) slugs.push(lastSegment)
		}
	}

	return slugs
}
