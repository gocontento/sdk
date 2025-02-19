'use server';

import type { ContentoClient } from '@client';
import { cookies, draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function enableDraftAndRedirect(
    client: ContentoClient,
    request: Request,
    secret: string
) {
    // Parse query string parameters and fail if things don’t line up
    const { searchParams } = new URL(request.url);
    const secretParam = searchParams.get('secret');
    const id = searchParams.get('id');
    if (secretParam !== secret || !id) {
        return new Response('Invalid token', { status: 401 });
    }

    // Fetch from Contento to check if the provided content ID exists
    const content = await client.getContentById(id);

    // If the content doesn't exist prevent draft mode from being enabled
    if (!content) {
        return new Response('Invalid slug', { status: 401 });
    }

    // Enable Next.js draft mode
    draftMode().enable();

    // Manually set the __prerender_bypass cookie - see https://github.com/vercel/next.js/issues/49927
    const draft = cookies().get('__prerender_bypass');
    const draftValue = draft?.value;
    if (draftValue) {
        cookies().set({
            name: '__prerender_bypass',
            value: draftValue,
            httpOnly: true,
            path: '/',
            secure: true,
            sameSite: 'none',
        });
    }

    // Redirect to the URI from the fetched content
    redirect(`/${content.uri}`);
}
