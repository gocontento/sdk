import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addImportsDir,
  addImports,
} from '@nuxt/kit'

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
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (nuxt.options.vite.optimizeDeps) {
      nuxt.options.vite.optimizeDeps.include =
        nuxt.options.vite.optimizeDeps.include || []
      nuxt.options.vite.optimizeDeps.include.push('@gocontento/client')
    }

    // Add auto imports
    const names = ['createContentoClient', 'ContentoClient']
    for (const name of names) {
      addImports({ name, as: name, from: '@gocontento/client' })
    }

    nuxt.options.typescript.hoist.push('@gocontento/client')

    // Set the options on the runtimeConfig
    nuxt.options.runtimeConfig.public.contento = {
      ...options,
    }

    // Plugin
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Composables
    addImportsDir(resolver.resolve('./runtime/composables'))
    //
    // // Routes
    // addServerHandler({
    //   route: '/api/draft',
    //   handler: resolver.resolve('./runtime/server/api/draft.get'),
    // });
    //
    // // Components
    // // From the runtime directory
    // // addComponent({
    // //     name: 'MySuperComponent', // name of the component to be used in vue templates
    // //     export: 'MySuperComponent', // (optional) if the component is a named (rather than default) export
    // //     filePath: resolver.resolve('runtime/components/MySuperComponent.vue')
    // // })
  },
})
