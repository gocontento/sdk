import { ContentoClient, createContentoClient } from '../../index';
import { ContentoRuntimeConfig } from '../../module';

import { useRuntimeConfig } from 'nuxt/app';
// <-- important, only way we can import it here, see https://github.com/nuxt/nuxt/discussions/16137#discussioncomment-6838967

export const useContentoClient = async (): Promise<ContentoClient> => {
    // Get our runtimeConfig options
    const config = useRuntimeConfig().public.contento as ContentoRuntimeConfig;

    // Create and return a client instance
    return createContentoClient({
        apiKey: config.apiKey,
        apiURL: config.apiUrl,
        siteId: config.siteId,
    });
};
