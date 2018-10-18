import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import graphql from 'rollup-plugin-graphql';
import nodeResolve from 'rollup-plugin-node-resolve';

import pkg from './package.json';

const { keys } = Object;

const externals = [
  ...keys(pkg.dependencies || {}),
  ...keys(pkg.peerDependencies || {}),
];

const makeExternalPredicate = (externalsArr) => {
  if (externalsArr.length === 0) return () => false;
  const externalPattern = new RegExp(`^(${externalsArr.join('|')})($|/)`);
  return id => externalPattern.test(id);
}

export default {
  experimentalCodeSplitting: true,
  input: [
    'src/utils.js',
    'src/routing.js',
    'src/components.js',
    'src/pages.js',
    'src/hoc.js',
  ],
  output: [
    { dir: 'dist/cjs', format: 'cjs' },
    { dir: 'dist/esm', format: 'esm' },
  ],
  external: makeExternalPredicate(externals),
  plugins: [
    nodeResolve({ extensions: ['.js', '.jsx'] }),
    commonjs({ include: ['node_modules/**'] }),
    graphql(),
    babel({ exclude: 'node_modules/**' }),
  ],
}