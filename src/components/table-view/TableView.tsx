import { For } from 'solid-js'
import type { Grade } from '@/components/grade-filter/grade'
import { GRADE_LABELS } from '@/components/grade-filter/grade'
import { topicHref } from '@/lib/href'
import { progressSlug } from '@/lib/progress'
import type { Topic } from '@/lib/topics'
import { formatTopicNumber, topicLabel } from '@/lib/topics'
import styles from './TableView.module.css'

const NUMERIC_GRADES = ['6', '7', '8', '9'] as const

interface TableViewProps {
	topics: Topic[]
	subject: string
	grade: Grade
	progress?: Record<string, boolean>
	onToggle?: (slug: string, completed: boolean) => void
}

export default function TableView(props: TableViewProps) {
	const isMuted = (g: string) => {
		return props.grade !== 'all' && props.grade !== g
	}

	return (
		<div class={styles.wrapper} data-testid="table-view">
			<table class={styles.table} aria-label="Přehled témat podle ročníků">
				<thead>
					<tr>
						<th class={styles.colNumber} scope="col">
							#
						</th>
						<th class={styles.colTopic} scope="col">
							Téma
						</th>
						<For each={NUMERIC_GRADES}>
							{(g) => (
								<th
									class={styles.colGrade}
									scope="col"
									data-grade={g}
									data-muted={isMuted(g) || undefined}
								>
									{GRADE_LABELS[g]}
								</th>
							)}
						</For>
					</tr>
				</thead>
				<tbody>
					<For each={props.topics}>
						{(topic) => (
							<tr>
								<td class={styles.colNumber}>
									{formatTopicNumber(topic.number)}
								</td>
								<td class={styles.colTopic}>
									<a href={topicHref(props.subject, topic.slug, 'all')}>
										{topic.title}
									</a>
								</td>
								<For each={NUMERIC_GRADES}>
									{(g) => {
										const available = topic.grades.includes(Number(g))
										const slug = progressSlug(
											props.subject,
											topic.slug,
											`${g}-rocnik`,
										)
										const label = `${topicLabel(topic)}, ${GRADE_LABELS[g]}`

										return (
											<td
												class={styles.colGrade}
												data-grade={g}
												data-muted={isMuted(g) || undefined}
											>
												{available ? (
													<>
														{props.progress !== undefined && (
															<input
																type="checkbox"
																checked={props.progress[slug] === true}
																aria-label={label}
																onChange={() =>
																	props.onToggle?.(
																		slug,
																		props.progress?.[slug] !== true,
																	)
																}
															/>
														)}
														<a
															href={topicHref(props.subject, topic.slug, g)}
															aria-label={`${topic.title} — ${GRADE_LABELS[g]}`}
														>
															✅
														</a>
													</>
												) : (
													'—'
												)}
											</td>
										)
									}}
								</For>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	)
}
