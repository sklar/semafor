import type { Accessor } from 'solid-js'
import { For } from 'solid-js'
import type { Grade } from '@/components/grade-filter/grade'
import { GRADE_LABELS } from '@/components/grade-filter/grade'
import { topicHref } from '@/lib/href'
import type { Topic } from '@/lib/topics'
import { formatTopicNumber } from '@/lib/topics'
import styles from './TableView.module.css'

const NUMERIC_GRADES = ['6', '7', '8', '9'] as const

interface TableViewProps {
	topics: Topic[]
	subject: string
	grade: Accessor<Grade>
}

export default function TableView(props: TableViewProps) {
	const isMuted = (g: string) => {
		const current = props.grade()
		return current !== 'all' && current !== g
	}

	return (
		<div class={styles.wrapper} data-testid="table-view">
			<table class={styles.table}>
				<thead>
					<tr>
						<th class={styles.colNumber}>#</th>
						<th class={styles.colTopic}>Téma</th>
						<For each={NUMERIC_GRADES}>
							{(g) => (
								<th
									class={styles.colGrade}
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
									{(g) => (
										<td
											class={styles.colGrade}
											data-grade={g}
											data-muted={isMuted(g) || undefined}
										>
											{topic.grades.includes(Number(g)) ? (
												<a href={topicHref(props.subject, topic.slug, g)}>✅</a>
											) : (
												'—'
											)}
										</td>
									)}
								</For>
							</tr>
						)}
					</For>
				</tbody>
			</table>
		</div>
	)
}
