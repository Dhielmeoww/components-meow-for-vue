import { createRequire } from 'node:module'
import vue from 'rollup-plugin-vue'
import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

const require = createRequire(import.meta.url)
const pkg = require('./package.json')

const external = [
    'vue',
    'quasar',
    'vue-iconsax',
    'axios',
    'tslib' // Add tslib to external dependencies
]

const globals = {
    vue: 'Vue',
    quasar: 'Quasar',
    'vue-iconsax': 'VueIconsax',
    axios: 'axios',
    tslib: 'tslib' // Add tslib to globals
}

export default [
    // ESM build
    {
        input: 'src/index.ts',
        external,
        output: {
            file: pkg.module,
            format: 'esm',
            globals
        },
        plugins: [
            resolve({ preferBuiltins: false }),
            commonjs(),
            typescript({
                declaration: false,
                declarationMap: false,
                tsconfig: './tsconfig.json' // Explicitly specify tsconfig
            }),
            vue({ css: false }),
            postcss({ extract: false, inject: true, minimize: true })
        ]
    },
    // UMD build
    {
        input: 'src/index.ts',
        external,
        output: {
            file: pkg.main,
            format: 'umd',
            name: 'VueQuasarComponents',
            globals
        },
        plugins: [
            resolve({ preferBuiltins: false }),
            commonjs(),
            typescript({
                declaration: false,
                declarationMap: false,
                tsconfig: './tsconfig.json' // Explicitly specify tsconfig
            }),
            vue({ css: false }),
            postcss({ extract: false, inject: true, minimize: true })
        ]
    }
]