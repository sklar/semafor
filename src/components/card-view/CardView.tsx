import { For, Show } from 'solid-js'
import type { Grade } from '@/components/grade-filter/grade'
import { topicHref } from '@/lib/href'
import { isTopicCompleted } from '@/lib/progress'
import type { Topic } from '@/lib/topics'
import { topicLabel } from '@/lib/topics'
import styles from './CardView.module.css'

interface CardProps {
	topic: Topic
}

function Card(props: CardProps) {
	return (
		<div class={styles.card} data-muted>
			<span class={styles.stack}>
				<span>
					<b class={styles.title}>{topicLabel(props.topic)}</b>
					<Show when={props.topic.description}>
						<div class={styles.description}>{props.topic.description}</div>
					</Show>
				</span>
			</span>
			<span class={styles.icon} />
		</div>
	)
}

interface CardWithLinkProps extends CardProps {
	href: string
	completed?: boolean
}

function CardWithLink(props: CardWithLinkProps) {
	return (
		<div class={styles.card}>
			<span class={styles.stack}>
				<a href={props.href}>
					<b class={styles.title}>{topicLabel(props.topic)}</b>
					<Show when={props.topic.description}>
						<div class={styles.description}>{props.topic.description}</div>
					</Show>
				</a>
			</span>
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				fill="currentColor"
				class={styles.icon}
			>
				<path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z" />
			</svg>
			<Show when={props.completed}>
				<svg
					role="img"
					aria-label="Hotovo"
					viewBox="0 0 24 24"
					fill="currentColor"
					class={styles.checkmark}
				>
					<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
				</svg>
			</Show>
		</div>
	)
}

interface CardViewProps {
	topics: Topic[]
	subject: string
	grade: Grade
	progress?: Record<string, boolean>
}

export default function CardView(props: CardViewProps) {
	return (
		<div class={styles.grid} data-testid="card-view">
			<For each={props.topics}>
				{(topic) => {
					const available = () =>
						props.grade === 'all' || topic.grades.includes(Number(props.grade))

					const completed = () =>
						props.progress
							? isTopicCompleted(
									props.progress,
									props.subject,
									topic.slug,
									props.grade === 'all' ? 'all' : `${props.grade}-rocnik`,
									topic.grades,
								)
							: false

					return (
						<Show when={available()} fallback={<Card topic={topic} />}>
							<CardWithLink
								topic={topic}
								href={topicHref(props.subject, topic.slug, props.grade)}
								completed={completed()}
							/>
						</Show>
					)
				}}
			</For>
		</div>
	)
}
