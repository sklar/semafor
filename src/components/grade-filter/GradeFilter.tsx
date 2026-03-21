import { For } from 'solid-js'
import styles from './GradeFilter.module.css'
import type { Grade } from './grade'
import { GRADE_LABELS, GRADES } from './grade'

interface GradeFilterProps {
	grade: Grade
	onGradeChange: (grade: Grade) => void
}

export default function GradeFilter(props: GradeFilterProps) {
	return (
		<fieldset class={styles.fieldset}>
			<legend class={styles.legend}>Ročník</legend>
			<For each={GRADES}>
				{(g) => (
					<label class={styles.label}>
						<input
							type="radio"
							name="grade"
							value={g}
							checked={props.grade === g}
							onChange={() => props.onGradeChange(g)}
						/>
						{GRADE_LABELS[g]}
					</label>
				)}
			</For>
		</fieldset>
	)
}
