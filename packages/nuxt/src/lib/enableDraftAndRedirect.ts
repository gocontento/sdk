import { createContentoClient } from '@client';
import { createError, getQuery, H3Event } from 'h3';
import jwt from 'jsonwebtoken';
import type { RuntimeConfig } from 'nuxt/schema';

export async function enableDraftAndRedirect(
    event: H3Event<Request>,
    config: RuntimeConfig
) {
    const query = getQuery(event) as {
        secret?: string;
        id?: string;
    };

    // Check the secret and ID parameters, this secret should only be known to this API route and the CMS - throw an error
    // if there is no ID or the secret doesn’t match what’s in runtimeConfig
    if (
        !query.secret ||
        !query.id ||
        query.secret !== config.public['contentoPreviewSecret']
    ) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid token',
        });
    }

    // Fetch content by ID from Contento to check if the provided content ID actually exists - here we also switch on
    // preview mode in the API for just this call so we can check if the draft of that content exists too
    const contentClient = createContentoClient({
        // @ts-ignore
        apiURL: config['contentoApiUrl'],
        // @ts-ignore
        siteId: config['contentoSiteId'],
        // @ts-ignore
        apiKey: config['contentoApiKey'],
        isPreview: true,
    });
    const content = await contentClient.getContentById(query.id);

    // If the content doesn't exist prevent draft mode from being enabled
    if (!content) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid content ID',
        });
    }

    // If we got this far we can now make a token and store it in a cookie - this can then be checked in our
    // useContentoPreview() composable
    // TODO: errors out
    // const token = jwt.sign(
    //     {
    //         previewSecret: config.public['contentoPreviewSecret'],
    //     },
    //     config.public['contentoPreviewSecret'], // <-- should we use a different token for signing?
    //     {
    //         expiresIn: 3600,
    //     }
    // );

    //
    // // Set it as a secure cooke in the response
    // event.node.res.setHeader(
    //   'Set-Cookie',
    //   `contento_preview=${token}; Secure; SameSite=None; Path=/; Max-Age=3600`,
    // )
    //
    // // Now we can redirect to the right URL and let the useContentoPreview composable test if the token
    // // is present and correct in the cookie store
    // return await sendRedirect(event, `/${content.uri}`, 302)

    return { working: 'yes', content: content };
}
