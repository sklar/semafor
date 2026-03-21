import { For } from 'solid-js'
import styles from './ViewToggle.module.css'
import type { View } from './view'
import { VIEW_LABELS, VIEWS } from './view'

interface ViewToggleProps {
	view: View
	onViewChange: (view: View) => void
}

export default function ViewToggle(props: ViewToggleProps) {
	return (
		<fieldset class={styles.fieldset}>
			<legend class={styles.legend}>Zobrazení</legend>
			<For each={VIEWS}>
				{(v) => (
					<label class={styles.label}>
						<input
							type="radio"
							name="view"
							value={v}
							checked={props.view === v}
							onChange={() => props.onViewChange(v)}
						/>
						{VIEW_LABELS[v]}
					</label>
				)}
			</For>
		</fieldset>
	)
}
