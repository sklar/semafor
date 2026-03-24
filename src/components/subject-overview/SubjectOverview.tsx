import { QueryClientProvider } from '@tanstack/solid-query'
import { createSignal, Match, onMount, Switch } from 'solid-js'
import CardView from '@/components/card-view/CardView'
import GradeFilter from '@/components/grade-filter/GradeFilter'
import type { Grade } from '@/components/grade-filter/grade'
import {
	DEFAULT_GRADE,
	GRADE_STORAGE_KEY,
	isGrade,
} from '@/components/grade-filter/grade'
import TableView from '@/components/table-view/TableView'
import Toast from '@/components/toast/Toast'
import ViewToggle from '@/components/view-toggle/ViewToggle'
import type { View } from '@/components/view-toggle/view'
import {
	DEFAULT_VIEW,
	isView,
	VIEW_STORAGE_KEY,
} from '@/components/view-toggle/view'
import { authClient } from '@/lib/auth-client'
import {
	createProgressMutation,
	createProgressQuery,
} from '@/lib/progress-hooks'
import { queryClient } from '@/lib/query-client'
import type { Topic } from '@/lib/topics'
import style from './SubjectOverview.module.css'

interface SubjectOverviewProps {
	topics: Topic[]
	subject: string
}

export default function SubjectOverview(props: SubjectOverviewProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<SubjectOverviewInner {...props} />
		</QueryClientProvider>
	)
}

function SubjectOverviewInner(props: SubjectOverviewProps) {
	const [grade, setGrade] = createSignal<Grade>(DEFAULT_GRADE)
	const [view, setView] = createSignal<View>(DEFAULT_VIEW)
	const [toastMessage, setToastMessage] = createSignal<string | undefined>()

	const session = authClient.useSession()
	const progress = createProgressQuery(props.subject, session)
	const mutation = createProgressMutation(props.subject)

	const onGradeChange = (g: Grade) => {
		setGrade(g)
		localStorage.setItem(GRADE_STORAGE_KEY, g)
	}

	const onViewChange = (v: View) => {
		setView(v)
		localStorage.setItem(VIEW_STORAGE_KEY, v)
	}

	const onToggle = async (slug: string, completed: boolean) => {
		try {
			await mutation.mutateAsync({ slug, completed })
		} catch {
			setToastMessage('Nepodařilo se uložit změnu')
		}
	}

	onMount(() => {
		const storedGrade = localStorage.getItem(GRADE_STORAGE_KEY)
		if (storedGrade && isGrade(storedGrade)) setGrade(storedGrade)
		const storedView = localStorage.getItem(VIEW_STORAGE_KEY)
		if (storedView && isView(storedView)) setView(storedView)
	})

	return (
		<>
			<div class={style.container}>
				<GradeFilter grade={grade()} onGradeChange={onGradeChange} />
				<ViewToggle view={view()} onViewChange={onViewChange} />
			</div>
			<Switch>
				<Match when={view() === 'cards'}>
					<CardView
						topics={props.topics}
						subject={props.subject}
						grade={grade()}
						progress={session()?.data ? progress.data : undefined}
					/>
				</Match>
				<Match when={view() === 'table'}>
					<TableView
						topics={props.topics}
						subject={props.subject}
						grade={grade()}
						progress={session()?.data ? progress.data : undefined}
						onToggle={onToggle}
					/>
				</Match>
			</Switch>
			<Toast
				message={toastMessage()}
				onDismiss={() => setToastMessage(undefined)}
			/>
		</>
	)
}
