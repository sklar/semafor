import type { Accessor } from 'solid-js'
import { For, Show } from 'solid-js'
import type { Grade } from '@/components/grade-filter/grade'
import { topicHref } from '@/lib/href'
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
				<path d="M17.92 11.62a1.001 1.001 0 0 0-.21-.33l-5-5a1.003 1.003 0 1 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1.002 1.002 0 0 0 .325 1.639 1 1 0 0 0 1.095-.219l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76Z"></path>
			</svg>
		</div>
	)
}

interface CardViewProps {
	topics: Topic[]
	subject: string
	grade: Accessor<Grade>
}

export default function CardView(props: CardViewProps) {
	return (
		<div class={styles.grid} data-testid="card-view">
			<For each={props.topics}>
				{(topic) => {
					const available = () =>
						props.grade() === 'all' ||
						topic.grades.includes(Number(props.grade()))

					return (
						<Show when={available()} fallback={<Card topic={topic} />}>
							<CardWithLink
								topic={topic}
								href={topicHref(props.subject, topic.slug, props.grade())}
							/>
						</Show>
					)
				}}
			</For>
		</div>
	)
}
