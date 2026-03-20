import { createSignal, onMount } from 'solid-js'
import { DEFAULT_GRADE } from '@/components/grade-filter/grade'
import TableView from '@/components/table-view/TableView'
import type { Topic } from '@/lib/topics'
import CardView from './CardView'

export default function CardViewIsland(props: {
	topics: Topic[]
	subject: string
}) {
	const [grade] = createSignal(DEFAULT_GRADE)
	let ref: HTMLDivElement | undefined

	onMount(() => {
		const staticCards = ref?.parentElement?.querySelector('[data-static-cards]')
		if (staticCards instanceof HTMLElement) {
			staticCards.hidden = true
		}
	})

	return (
		<div ref={ref}>
			<CardView topics={props.topics} subject={props.subject} grade={grade} />
			<TableView topics={props.topics} subject={props.subject} grade={grade} />
		</div>
	)
}
