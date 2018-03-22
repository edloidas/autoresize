import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/browser.js',
  output: {
    file: 'dist/autoresize.js',
    format: 'iife'
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs()
  ]
};
