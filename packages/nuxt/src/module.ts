import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {
  apiUrl: string
  apiKey: string
  siteId: string
  previewSecret: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@gocontento/nuxt',
    configKey: 'contento',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    apiUrl: '',
    apiKey: '',
    siteId: '',
    previewSecret: '',
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url)

    console.log('main module setup function')

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
