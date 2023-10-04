/// <reference types="vitest" />
import { defineConfig } from 'vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import preserveDirectives from 'rollup-plugin-preserve-directives';

export default defineConfig({
    cacheDir: '../../node_modules/.vite/next',

    plugins: [
        dts({
            entryRoot: 'src',
            tsConfigFilePath: path.join(__dirname, 'tsconfig.lib.json'),
            skipDiagnostics: true,
        }),
        nxViteTsPaths(),
        preserveDirectives(),
    ],

    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },

    // Configuration for building your library.
    // See: https://vitejs.dev/guide/build.html#library-mode
    build: {
        sourcemap: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points.
            entry: 'src/index.ts',
            name: 'next',
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
            // Change this to the formats you want to support.
            // Don't forget to update your package.json as well.
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            // External packages that should not be bundled into your library.
            external: [
                'react',
                'next',
                // exclude sub packages too eg. next/headers
                /^next\//,
                /^react\//,
            ],
            output: {
                preserveModules: true,
                inlineDynamicImports: false,
                globals: { react: 'React', next: 'Next' },
            },
        },
    },
});
