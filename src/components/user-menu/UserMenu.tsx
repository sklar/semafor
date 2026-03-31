import { Match, Switch } from 'solid-js'
import { authClient } from '@/lib/auth-client'
import style from './UserMenu.module.css'

export default function UserMenu() {
	const session = authClient.useSession()
	const authAvailable = () => session().isPending || !session().error

	const handleSignIn = () =>
		authClient.signIn.social({ provider: 'google' }).catch(() => {})
	const handleSignOut = () => authClient.signOut().catch(() => {})

	return (
		<div class={style.menu}>
			<Switch>
				<Match when={session().data?.user}>
					{(user) => (
						<>
							<span class={style.name}>{user().name}</span>
							<button
								type="button"
								class={style.signOut}
								onClick={handleSignOut}
							>
								Odhlásit
							</button>
						</>
					)}
				</Match>
				<Match when={authAvailable()}>
					<button type="button" class={style.signIn} onClick={handleSignIn}>
						Přihlásit se
					</button>
				</Match>
			</Switch>
		</div>
	)
}
