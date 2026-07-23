# Deployment, one page

The site is a Vite single-page app. It builds to a static `dist/` folder and is served on **Vercel**. `vercel.json` configures the build, the SPA rewrite (so deep links like `/team` resolve to `index.html`), and the security + caching headers.

## Vercel, link from GitHub (recommended)

1. Push this repo to a GitHub account/org the cell controls.
2. In Vercel, "Add New… → Project" → import the GitHub repo.
3. Vercel reads `vercel.json` and configures the build automatically:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click "Deploy". The first build takes about 60 seconds.
5. Add the domain under Project → Settings → Domains. SSL is automatic.

## Vercel CLI (no GitHub needed)

```bash
npm install
npm run build
npx vercel        # preview deploy
npx vercel --prod # production deploy
```

## Local production preview

```bash
npm run build
npm run preview
# Opens http://localhost:4173
```

## Continuous deployment

Once the GitHub repo is linked, every push to `main` triggers a production deploy, and every pull request gets its own preview URL automatically.

## Environment variables

No environment variables are required for the static MVP build — everything runs client-side. Set these in Vercel → Project → Settings → Environment Variables to light up the wired integration points:

- `VITE_FORM_ENDPOINT` — POST target for the recruiter / feedback / alumni forms (a Formspree URL, a Google Apps Script webhook, or a serverless function). When unset, the forms fall back to a pre-filled `mailto:placement@svc.ac.in`.
- `VITE_ADMIN_CODE` — passcode required to unlock the `/admin` console. When unset, the console is clearly labelled as an unauthenticated preview.

These are read at build time via `import.meta.env`. Prefix must stay `VITE_` for Vite to expose them to the client.

## Domain ownership

The site should be served from an `svc.ac.in` subdomain managed by the college, with a redirect from the cell's preferred short link. The Faculty Convener authorizes domain changes.

## Rollback

Every Vercel deploy is preserved. From the Vercel "Deployments" tab, open any prior deployment and use "Promote to Production" to roll back. No code change needed.

> A `netlify.toml` is also kept in the repo so the site can be dragged into Netlify as a fallback host; Vercel ignores it.
