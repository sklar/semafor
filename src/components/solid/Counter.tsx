import { createSignal } from 'solid-js'

/** Smoke-test component — remove once real Solid components land. */
export default function Counter() {
	const [count, setCount] = createSignal(0)

	return (
		<button type="button" onClick={() => setCount((c) => c + 1)}>
			Count: {count()}
		</button>
	)
}
