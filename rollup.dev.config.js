import replace from 'rollup-plugin-replace'
import eslint from 'rollup-plugin-eslint'

import path from 'path'
import fs from 'fs'


import config from './src/config.js'

const BOT_TOKEN = config[`SLACK_BOT_TOKEN_${process.env.APP}`];
const getPaths = () => {
  switch (process.env.APP) {
    case 'CAMPAGNE': 
      return {dist: 'bundle.camp', src: 'index.campagne'};
    case 'D3': 
      return {dist: 'bundle.d3', src: 'index'};
    case 'GEUUU': 
      return {dist: 'bundle.geu', src: 'index.geu'};
    default:
      return {dist: 'bundle.d3', src: 'index'};
  }
}

const rawRootJS = fs.readFileSync(path.resolve( 'src/root.js' )).toString();
const rootJS = rawRootJS.replace('SLACK_BOT_TOKEN', JSON.stringify( BOT_TOKEN ))

export default {
  entry: `src/${getPaths().src}.js`,
  dest: `dist/${getPaths().dist}.js`,
  format: 'umd',
  moduleName: process.env.APP,
  plugins: [
    replace({
      values: {
        rootJS: rootJS,
        SLACK_BOT_TOKEN: JSON.stringify( BOT_TOKEN ),
      }
    }),
    eslint()
  ],
  sourceMap: true
};