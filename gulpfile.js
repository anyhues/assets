const gulp = require('gulp')
const gutil = require('gulp-util')
const print = require('gulp-print')
const sequence = require('gulp-sequence')
const ghPages = require('gulp-gh-pages')

const config = require('./lib/config')

const tasks = [
  require('./lib/tasks/image-tasks'),
  require('./lib/tasks/style-tasks'),
  require('./lib/tasks/font-tasks'),
  require('./lib/tasks/release-tasks'),
  require('./lib/tasks/development-tasks')
]

tasks.forEach(service => service.load(gulp, config))

gulp.task('run', sequence(['watch']))

gulp.task('deploy', ['dist'], () => {
  gulp.src([config.get('distGlob')])
  .pipe(ghPages({
    remoteUrl: 'git@github.com:niehues-assets/niehues-assets.github.io.git',
    branch: 'master',
    force: false
  }).on('error', gutil.log))
  .pipe(print())
})
