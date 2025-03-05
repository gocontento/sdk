import {
  createError,
  defineEventHandler,
  getQuery,
  sendRedirect,
  setCookie,
} from 'h3'
import { useContentoClient } from '../../composables/useContentoClient'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const config = useRuntimeConfig(event).public.contento

  // Check the secret and ID parameters, this secret should only be known to this API route and the CMS - throw an error
  // if there is no ID or the secret doesn’t match what’s in runtimeConfig
  if (
    query.secret !== config.previewSecret ||
    !query.id ||
    typeof query.id !== 'string'
  ) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    })
  }

  // Fetch content by ID from Contento to check if the provided content ID actually exists - here we also switch on
  // preview mode in the API for just this call so we can check if the draft of that content exists too
  const client = await useContentoClient()
  const content = await client.getContentById(query.id)

  // If the content doesn't exist prevent draft mode from being enabled
  if (!content) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid content ID',
    })
  }

  // Set a cookie to flag that the preview mode is on
  setCookie(event, 'contento_preview', 'true', {
    secure: true,
    sameSite: 'none',
    path: '/',
    maxAge: 3600,
  })

  // Now we can redirect to the right URL
  return await sendRedirect(event, `/${content.uri}`, 302)
})
