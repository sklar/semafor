# Local Development Setup

## 🌳 Environment Variables

Copy the example file and fill in the values:

```sh
cp .env.example .env
```

| Variable | Required | How to get |
|----------|----------|------------|
| `SITE_URL` | no | `http://localhost:4321` for local dev |
| `BETTER_AUTH_SECRET` | yes | `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | yes | `http://localhost:4321` for local dev |
| `GOOGLE_CLIENT_ID` | yes | Google Cloud Console (see below) |
| `GOOGLE_CLIENT_SECRET` | yes | Google Cloud Console (see below) |
| `UMAMI_WEBSITE_ID` | no | Umami analytics dashboard |

Without auth variables the site still runs — auth features hide themselves gracefully.

## 💂‍♂️ Google OAuth Credentials

> [!IMPORTANT]
> These credentials are for local development only. You can always view/regenerate them in the Console later. For production, create a separate OAuth client with the production redirect URI and store secrets via `wrangler secret put`.

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g. `Semafor local`) or select an existing one
3. Navigate to **APIs & Services > OAuth consent screen**
   - Choose **External** user type
   - Fill in app name, support email and developer contact
   - Skip scopes (defaults are fine)
   - Add your Google email under **Test users**<br />
	 (only listed users can sign in while app is in _Testing status_)
4. Navigate to **APIs & Services > Credentials**
   - Click **Create Credentials > OAuth client ID**
   - Choose **Web application** app type
   - Add authorized redirect URI: `http://localhost:4321/api/auth/callback/google`
5. Copy **Client ID** and **Client Secret** into your `.env`


## 🗄️ D1 Database (Local)

The Cloudflare adapter's `platformProxy` option creates a local SQLite-backed D1 automatically. Apply migrations:

```sh
wrangler d1 migrations apply semafor-db --local
```

## 🔐 Production Secrets (Cloudflare)

When deploying, store secrets via Wrangler:

```sh
wrangler secret put BETTER_AUTH_SECRET
wrangler secret put BETTER_AUTH_URL
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET
```

Create a separate Google OAuth client with your production redirect URI:
`https://<your-domain>/api/auth/callback/google`
