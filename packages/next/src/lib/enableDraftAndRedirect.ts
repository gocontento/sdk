import { ContentoClient } from '@client';
import { draftMode } from 'next/headers';
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
    const secretParam = searchParams.get('secret');
    const slug = searchParams.get('slug');
    if (secretParam !== secret || !slug) {
        return new Response('Invalid token', { status: 401 });
    }

    // Fetch the headless CMS to check if the provided `slug` exists
    // getPostBySlug would implement the required fetching logic to the headless CMS
    const post = await client.getContentBySlug(slug);

    // If the slug doesn't exist prevent draft mode from being enabled
    if (!post) {
        return new Response('Invalid slug', { status: 401 });
    }

    draftMode().enable();

    // Redirect to the path from the fetched post
    // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
    redirect(`/${post.uri}`);
}
