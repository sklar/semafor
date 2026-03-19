import type { Accessor } from 'solid-js'
import { For, Show } from 'solid-js'
import type { Grade } from '@/components/grade-filter/grade'
import { topicHref } from '@/lib/href'
import type { Topic } from '@/lib/topics'
import styles from './CardView.module.css'

interface CardViewProps {
	topics: Topic[]
	subject: string
	grade: Accessor<Grade>
}

export default function CardView(props: CardViewProps) {
	return (
		<div class={styles.grid}>
			<For each={props.topics}>
				{(topic) => (
					<div class={styles.card}>
						<span class={styles.stack}>
							<a href={topicHref(props.subject, topic.slug, props.grade())}>
								<b class={styles.title}>{topic.title}</b>
								<Show when={topic.description}>
									<div class={styles.description}>{topic.description}</div>
								</Show>
							</a>
						</span>
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							fill="currentColor"
							class={styles.icon}
						>
							<path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"></path>
						</svg>
					</div>
				)}
			</For>
		</div>
	)
}
