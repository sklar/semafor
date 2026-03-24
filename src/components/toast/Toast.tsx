import { createEffect, onCleanup, Show } from 'solid-js'
import styles from './Toast.module.css'

interface ToastProps {
	message: string | undefined
	onDismiss?: () => void
	duration?: number
}

export default function Toast(props: ToastProps) {
	createEffect(() => {
		if (!props.message) return

		const timer = setTimeout(() => props.onDismiss?.(), props.duration ?? 5000)
		onCleanup(() => clearTimeout(timer))
	})

	return (
		<Show when={props.message}>
			<div class={styles.toast} role="alert" aria-live="polite">
				<span>{props.message}</span>
				<button
					type="button"
					class={styles.close}
					aria-label="Zavřít"
					onClick={() => props.onDismiss?.()}
				>
					✕
				</button>
			</div>
		</Show>
	)
}
