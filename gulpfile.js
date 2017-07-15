const gulp = require('gulp')
const rollup = require('rollup').rollup
const nodemon = require('gulp-nodemon')
const replace = require('rollup-plugin-replace')
const eslint = require('rollup-plugin-eslint')
const fs = require('fs')
const clean = require('gulp-clean')
var runSequence = require('run-sequence')

const config = require('./src/config.js')

const distDir = './dist'

if (!fs.existsSync(distDir)){
  fs.mkdirSync(distDir)
}

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

const entryPath = `src/${getPaths().src}.js`;


gulp.task('rollup', () => {
  return rollup({
    entry: entryPath,
    watch: true,
    format: 'umd',
    moduleName: process.env.APP,
    plugins: [
      replace({
        values: {
          SLACK_BOT_TOKEN: JSON.stringify( BOT_TOKEN ).replace(/"/g, '\''),
        }
      }),
      eslint()
    ],
    sourceMap: true
  }).then(async (bundle) => {
    const result = await bundle.generate();
    fs.writeFileSync(`dist/${getPaths().dist}.js`, result.code);
    console.log('---------- ENDED ----------')
  })
})

gulp.task('nodemon', () => {
  nodemon({
    script: `dist/${getPaths().dist}.js`,
    ext: 'js',
    delay: '2500ms',
    watch: `dist/${getPaths().dist}.js`,
  })
})

gulp.task('watch', () => {
  gulp.watch(['./src/root.js', entryPath], ['rollup'])
})

gulp.task('clean', [ 'rollup', 'nodemon' ] , () => {
  return gulp.src('dist/*.js', {read: false})
    .pipe(clean())
})

gulp.task('start', () => {
  runSequence('clean', 'rollup', 'nodemon')
})

gulp.task('default', [ 'start', 'watch' ])
