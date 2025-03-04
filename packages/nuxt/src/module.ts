import {
    defineNuxtModule,
    createResolver,
    addPlugin,
    addImportsDir,
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
    defaults: {},
    setup(options, nuxt) {
        const resolver = createResolver(import.meta.url);

        // Set the options on the runtimeConfig
        nuxt.options.runtimeConfig.public.contento = {
            apiUrl: options.apiUrl,
            apiKey: options.apiKey,
            siteId: options.siteId,
            previewSecret: options.previewSecret,
        } as ContentoRuntimeConfig;

        // Plugin
        addPlugin(resolver.resolve('./runtime/plugin.ts'));

        // Composables
        addImportsDir(resolver.resolve('./runtime/composables'));

        // Routes
        // addServerHandler({
        //     route: '/api/hello',
        //     handler: resolver.resolve('./runtime/server/api/hello/index.get')
        // })

        // Components
        // From the runtime directory
        // addComponent({
        //     name: 'MySuperComponent', // name of the component to be used in vue templates
        //     export: 'MySuperComponent', // (optional) if the component is a named (rather than default) export
        //     filePath: resolver.resolve('runtime/components/MySuperComponent.vue')
        // })
    },
});
