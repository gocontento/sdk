import { ContentoClient } from '@contento/client';
import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function enableDraftAndRedirect(
  client: ContentoClient,
  request: Request,
  secret: string
) {
  // Check the secret and next parameters.
  // This secret should only be known to this API route and the CMS

  // Parse query string parameters
  const { searchParams } = new URL(request.url);
  const previewSecret = searchParams.get('secret');
  const slug = searchParams.get('slug');
  if (previewSecret !== secret || !slug) {
    return new Response('Invalid token', { status: 401 });
  }

  const shouldPreviewDraft = searchParams.get('draft') === 'true';

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const post = await client.getContentBySlug(slug, shouldPreviewDraft);

  // If the slug doesn't exist prevent draft mode from being enabled
  if (!post) {
    return new Response('Invalid slug', { status: 401 });
  }

  // Enable Draft Mode by setting the cookie
  // res.setDraftMode({ enable: true })
  // res.setPreviewData({
  //   shouldPreviewDraft,
  // });
  draftMode().enable();
  cookies().set('shouldPreviewDraft', shouldPreviewDraft.toString());

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  redirect(`/posts/${post.slug}`);
}
