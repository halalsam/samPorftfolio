import { revalidatePath, revalidateTag } from 'next/cache';

// Strapi webhook target: Settings → Webhooks → POST
//   https://<site>/api/revalidate   header  x-revalidate-secret: <REVALIDATE_SECRET>
// Purges cached Strapi responses so edits go live without a redeploy.
export async function POST(request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get('x-revalidate-secret') !== secret) {
    return Response.json({ revalidated: false, message: 'Invalid secret' }, { status: 401 });
  }
  revalidateTag('projects', 'max');
  revalidatePath('/');
  revalidatePath('/projects/[slug]', 'page');
  return Response.json({ revalidated: true, now: Date.now() });
}
