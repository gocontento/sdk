/// <reference types='vitest' />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';

export default defineConfig({
    root: __dirname,
    cacheDir: '../../node_modules/.vite/packages/nuxt',
    plugins: [
        vue(),
        nxViteTsPaths(),
        nxCopyAssetsPlugin([
            {
                input: './src/runtime', // look in the src folder
                glob: '**/*.ts', // for any file (in any folder) that is not a typescript file
                output: './runtime', // put those files in the src folder of the output bundle
            },
        ]),
        dts({
            entryRoot: 'src',
            tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
        }),
    ],
    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
        outDir: '../../dist/packages/nuxt',
        emptyOutDir: true,
        reportCompressedSize: true,
        commonjsOptions: {
            transformMixedEsModules: true,
        },
        sourcemap: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points.
            entry: ['src/index.ts', 'src/module.ts'],
            name: 'nuxt',
            fileName: (format, entry) => {
                const name = entry.split('/').pop();
                switch (format) {
                    case 'es': {
                        return `${name}.js`;
                    }

                    case 'cjs': {
                        return `${name}.cjs`;
                    }
                }

                throw new Error(`Unsupported format: ${format}`);
            },
            formats: ['es'],
        },
        rollupOptions: {
            // External packages that should not be bundled into your library.
            external: [
                '@nuxt/schema',
                '@nuxt/kit',
                'vue',
                'nuxt',
                // exclude sub packages too eg. next/headers
                /^nuxt\//,
                /^vue\//,
            ],
            output: {
                preserveModules: true,
                inlineDynamicImports: false,
                globals: {
                    vue: 'Vue',
                    nuxt: 'Nuxt',
                    '@nuxt/schema': 'NuxtSchema',
                    '@nuxt/kit': 'NuxtKit',
                },
            },
        },
    },
    test: {
        watch: false,
        globals: true,
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        reporters: ['default'],
        coverage: {
            reportsDirectory: '../../coverage/packages/nuxt',
            provider: 'v8',
        },
    },
});
