# Strapi drop-in for project content

These files define a Strapi v5 `project` collection whose fields and page-builder components match `src/content` exactly. Moving from local files to the CMS changes nothing in the site's components.

```
src/api/project/            content type + core controller/route/service
src/components/blocks/*     13 page blocks (the `blocks` dynamic zone)
src/components/shared/*     link, theme, hero, seo, fact, feature, stat, stack-group,
                            arch-layer/arch-node, timeline-item, gallery-item, swatch, typeface
```

## Set up

1. **Create the app.** `npx create-strapi@latest cms`, then copy this `src/` folder into it and restart.
2. **Open the API.** Under *Settings → Users & Permissions → Public*, allow `find` and `findOne` on **Project**. Alternatively, create a read-only API token.
3. **Enter content.** Media goes in the Media Library. In the CMS, the `platforms` field and stack `items` are comma- or line-separated text, and architecture `notes` are one per line; on the site they come back as arrays.
4. **Point the site at it** with these environment variables:
   ```bash
   STRAPI_URL=https://cms.your-domain.com
   STRAPI_API_TOKEN=...            # if the API isn't public
   REVALIDATE_SECRET=some-long-random-string
   NEXT_PUBLIC_SITE_URL=https://your-portfolio.com
   ```
5. **Add the webhook** under *Settings → Webhooks*. Send `POST https://your-portfolio.com/api/revalidate` with the header `x-revalidate-secret: <REVALIDATE_SECRET>` on Entry publish, update and delete events.

## Behaviour

- **Source switch:** when `STRAPI_URL` is set, `lib/content` reads `/api/projects` with the populate query built from `lib/content/blocks.js`, using Strapi v5 dynamic-zone `on` fragments. Responses are cached and tagged `projects`, and the webhook purges them.
- **Fallback:** if Strapi is down or misconfigured, the site logs a warning and serves the local `src/content` files, so it never renders empty.
- **New slugs:** a slug published in Strapi renders on its first request (`dynamicParams`) without a redeploy.
- **Images:** `next.config.js` adds the Strapi host to the allowed image domains automatically.
- **Compatibility:** the normalizer accepts both Strapi v5's flat responses and v4-style `data.attributes` wrapping.
