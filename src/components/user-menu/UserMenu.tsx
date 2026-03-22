import { Show } from 'solid-js'
import { authClient } from '@/lib/auth-client'
import style from './UserMenu.module.css'

export default function UserMenu() {
	const session = authClient.useSession()

	return (
		<div class={style.menu}>
			<Show
				when={session().data?.user}
				fallback={
					<button
						type="button"
						class={style.signIn}
						onClick={() => authClient.signIn.social({ provider: 'google' })}
					>
						Přihlásit se
					</button>
				}
			>
				{(user) => (
					<>
						<span class={style.name}>{user().name}</span>
						<button
							type="button"
							class={style.signOut}
							onClick={() => authClient.signOut()}
						>
							Odhlásit
						</button>
					</>
				)}
			</Show>
		</div>
	)
}
