import { useRuntimeConfig } from 'nuxt/app';
import { ContentoClient, createContentoClient } from '../../index';
import { ContentoRuntimeConfig } from '../../module';

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
