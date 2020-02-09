/*
 * @Author: xiuquanxu
 * @Company: kaochong
 * @Date: 2020-01-14 23:28:31
 * @LastEditors: xiuquanxu
 * @LastEditTime: 2020-02-09 12:53:00
 */
import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'  

export default {
    input: 'src/index.ts',
    output: {
        file: `dist/EasyIndexDB.min.js`,
        format: 'umd',
        name: 'BetterWorker',
        sourceMap: true,
    },
    plugins: [
        resolve(),
        uglify(),
        commonjs({}),
        typescript({
            tsconfig: './tsconfig.json',
            verbosity: 3,
        }),
    ],
};