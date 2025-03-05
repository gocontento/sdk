import {
    defineNuxtModule,
    createResolver,
    addPlugin,
    addImportsDir,
    addServerHandler,
} from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {
    apiUrl: string;
    apiKey: string;
    siteId: string;
    previewSecret: string;
}

export interface ContentoRuntimeConfig {
    apiUrl: string;
    apiKey: string;
    siteId: string;
    previewSecret: string;
}

export default defineNuxtModule<ModuleOptions>({
    meta: {
        name: '@gocontento/nuxt',
        configKey: 'contento',
    },
    // Default configuration options of the Nuxt module
    defaults: {
        apiUrl: process.env.CONTENTO_API_URL ?? '',
        apiKey: process.env.CONTENTO_API_KEY ?? '',
        siteId: process.env.CONTENTO_SITE_ID ?? '',
        previewSecret: process.env.CONTENTO_PREVIEW_SECRET ?? '',
    },
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        // Set the options on the runtimeConfig
        nuxt.options.runtimeConfig.public.contento = {
            ...options,
        } as ContentoRuntimeConfig;

        // Plugin
        addPlugin(resolver.resolve('./runtime/plugin.ts'));

        // Composables
        addImportsDir(resolver.resolve('./runtime/composables'));

        // Routes
        addServerHandler({
            route: '/api/draft',
            handler: resolver.resolve('./runtime/server/api/draft.get'),
        });

        // Components
        // From the runtime directory
        // addComponent({
        //     name: 'MySuperComponent', // name of the component to be used in vue templates
        //     export: 'MySuperComponent', // (optional) if the component is a named (rather than default) export
        //     filePath: resolver.resolve('runtime/components/MySuperComponent.vue')
        // })
    },
});
