// TODO: fix this and we’re golden ----vvv
import { createContentoClient } from '@gocontento/client'
import type { ContentoClient } from '@gocontento/client'
import { useRuntimeConfig } from '#imports'

export const useContentoClient = async (): Promise<ContentoClient> => {
  // Get our runtimeConfig options
  const config = useRuntimeConfig().public.contento

  // Create and return a client instance
  return createContentoClient({
    apiKey: config.apiKey,
    apiURL: config.apiUrl,
    siteId: config.siteId,
  })
}
