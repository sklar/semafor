import { createSignal, onMount, Show } from 'solid-js'
import CardView from '@/components/card-view/CardView'
import GradeFilter from '@/components/grade-filter/GradeFilter'
import type { Grade } from '@/components/grade-filter/grade'
import {
	DEFAULT_GRADE,
	GRADE_STORAGE_KEY,
} from '@/components/grade-filter/grade'
import TableView from '@/components/table-view/TableView'
import ViewToggle from '@/components/view-toggle/ViewToggle'
import type { View } from '@/components/view-toggle/view'
import { DEFAULT_VIEW, VIEW_STORAGE_KEY } from '@/components/view-toggle/view'
import type { Topic } from '@/lib/topics'
import style from './SubjectOverview.module.css'

interface SubjectOverviewProps {
	topics: Topic[]
	subject: string
}

export default function SubjectOverview(props: SubjectOverviewProps) {
	const [grade, setGrade] = createSignal<Grade>(DEFAULT_GRADE)
	const [view, setView] = createSignal<View>(DEFAULT_VIEW)
	const onGradeChange = (g: Grade) => {
		setGrade(g)
		localStorage.setItem(GRADE_STORAGE_KEY, g)
	}

	const onViewChange = (v: View) => {
		setView(v)
		localStorage.setItem(VIEW_STORAGE_KEY, v)
	}

	onMount(() => {
		const storedGrade = localStorage.getItem(GRADE_STORAGE_KEY) as Grade | null
		if (storedGrade) setGrade(storedGrade)
		const storedView = localStorage.getItem(VIEW_STORAGE_KEY) as View | null
		if (storedView) setView(storedView)
	})

	return (
		<>
			<div class={style.container}>
				<GradeFilter grade={grade} onGradeChange={onGradeChange} />
				<ViewToggle view={view} onViewChange={onViewChange} />
			</div>
			<Show when={view() === 'cards'}>
				<CardView topics={props.topics} subject={props.subject} grade={grade} />
			</Show>
			<Show when={view() === 'table'}>
				<TableView
					topics={props.topics}
					subject={props.subject}
					grade={grade}
				/>
			</Show>
		</>
	)
}
