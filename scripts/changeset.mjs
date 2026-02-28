#!/usr/bin/env node

import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import * as p from '@clack/prompts'

const CHANGESET_DIR = '.changesets'

p.intro('New changeset')

const result = await p.group(
	{
		type: () =>
			p.select({
				message: 'What kind of change is this? (press enter to skip)',
				options: [
					{ value: '', label: 'Skip', hint: 'no category' },
					{
						value: 'chore',
						label: 'Chore',
						hint: 'clean-ups, minor tweaks, not visible to user',
					},
					{
						value: 'ci',
						label: 'CI',
						hint: 'build, deploy, dependencies, workflows',
					},
					{
						value: 'content',
						label: 'Content',
						hint: 'new or updated articles, pages, copy',
					},
					{
						value: 'doc',
						label: 'Doc',
						hint: 'documentation (README, guides)',
					},
					{
						value: 'feature',
						label: 'Feature',
						hint: 'new functionality or integration',
					},
					{ value: 'fix', label: 'Fix', hint: 'bug fix, broken link, typo' },
					{ value: 'test', label: 'Test', hint: 'test additions or changes' },
				],
			}),

		scope: () =>
			p.text({
				message: 'What area is affected? (optional, press enter to skip)',
				placeholder: 'e.g. blog, homepage, navigation, api',
			}),

		summary: () =>
			p.text({
				message: 'Short summary of the change',
				placeholder: 'Add new article about...',
				validate: (v) => {
					if (!v?.trim()) return 'Summary is required'
				},
			}),

		details: () =>
			p.text({
				message: 'Longer description (optional, markdown supported)',
				placeholder: 'Press enter to skip',
			}),
	},
	{
		onCancel: () => {
			p.cancel('Changeset cancelled.')
			process.exit(0)
		},
	},
)

// Generate changeset file
const id = crypto.randomBytes(4).toString('hex')
const timestamp = new Date().toISOString()
const type = result.type || 'changeset'
const filename = `${type}-${id}.md`

const typeLine = result.type ? `type: ${result.type}` : ''
const scopeLine = result.scope?.trim() ? `scope: ${result.scope.trim()}` : ''

const content = [
	'---',
	typeLine,
	scopeLine,
	`date: ${timestamp}`,
	'---',
	'',
	`${result.summary.trim()}`,
	result.details?.trim() ? `\n${result.details.trim()}` : '',
	'',
]
	.filter(Boolean)
	.join('\n')

// Ensure .changesets dir exists
if (!fs.existsSync(CHANGESET_DIR)) {
	fs.mkdirSync(CHANGESET_DIR, { recursive: true })
}

const filepath = path.join(CHANGESET_DIR, filename)
fs.writeFileSync(filepath, content)

p.outro(`Created ${filepath}`)
