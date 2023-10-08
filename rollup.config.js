import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';
import { defineConfig } from 'rollup';

const publicConfig = {
  format: 'umd',
  name: 'uodule',
};

const config = defineConfig([
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'lib/index.js',
        ...publicConfig,
      },
      {
        file: 'lib/index.min.js',
        ...publicConfig,
        plugins: [terser()],
      },
    ],
    plugins: [
      typescript({
        declaration: false,
        target: 'ES5',
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.mjs',
      format: 'esm',
    },
    plugins: [
      typescript({
        declaration: false,
      }),
    ],
  },
  // 归并 .d.ts 文件
  // {
  //   input: 'types/index.d.ts',
  //   output: {
  //     file: 'index.d.ts',
  //     format: 'es',
  //   },
  //   plugins: [
  //     // 将类型文件全部集中到一个文件中
  //     dts(),
  //     // 在构建完成后，删除 types 文件夹
  //     del({
  //       targets: 'types',
  //       hook: 'buildEnd',
  //     }),
  //   ],
  // },
]);

export default config;
