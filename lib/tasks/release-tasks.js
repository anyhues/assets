const print = require('gulp-print')
const rev = require('gulp-rev')
const revReplace = require('gulp-rev-replace')
const del = require('del')
const sequence = require('gulp-sequence')
const gzip = require('gulp-gzip')

module.exports = {}
module.exports.load = (gulp, config) => {
  const revisionFiles = () => config.get('env') === 'production'

  gulp.task('clean-rev-file', () => del(`${config.get('rootPath')}/rev-manifest.json`))
  gulp.task('clean-vendor-assets', () => del(config.get('vendorBuildPath')))

  gulp.task('vendor-assets', ['clean-vendor-assets'], () => {
    return gulp.src([config.get('vendorGlob'), 'node_modules/picturefill/dist/picturefill.min.js'])
    .pipe(gulp.dest(config.get('vendorBuildPath')))
  })

  gulp.task('dist-vendor-assets', ['vendor-assets'], () => {
    return gulp.src(`${config.get('vendorBuildPath')}/**/*`)
    .pipe(gulp.dest(`${config.get('vendorBuildPath')}/vendor`))
  })

  gulp.task('rev-images', ['images'], () => {
    return gulp.src(config.get('imagesBuildGlob'), { base: config.get('buildPath') })
    .pipe(rev())
    .pipe(gulp.dest(config.get('distPath')))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.get('rootPath')))
  })

  gulp.task('rev-assets', ['styles', 'rev-images'], function () {
    const manifest = gulp.src('rev-manifest.json')

    return gulp.src(config.get('styleBuildGlob'), { base: config.get('buildPath') })
    .pipe(revReplace({manifest: manifest}))
    .pipe(rev())
    .pipe(gulp.dest(config.get('distPath')))  // write rev'd assets to dist dir
    .pipe(rev.manifest({
      base: `${config.get('rootPath')}`,
      merge: true
    }))
    .pipe(print((file) => `${file} reference file`))
    .pipe(gulp.dest(config.get('rootPath'))) // write manifest to dist dir
  })

  gulp.task('gzip', () => {
    gulp.src(config.get('distGzipGlob'))
    .pipe(gzip())
    .pipe(gulp.dest(config.get('distPath')))
  })

  gulp.task('prod-fonts', ['fonts'], () => {
    return gulp.src(config.get('fontBuildGlob'))
    .pipe(gulp.dest(config.get('fontDistPath')))
  })

  gulp.task('build', ['styles', 'fonts', 'images', 'vendor-assets'])

  gulp.task('check-prod-mode', () => {
    if (config.get('env') !== 'production') throw new Error('production only task!')
  })

  gulp.task('clean-dist', () => del(config.get('distPath')))

  gulp.task('dist', (cb) => {
    sequence('check-prod-mode', 'clean-dist', 'clean-rev-file', 'dist-vendor-assets', 'rev-assets', 'gzip', 'prod-fonts')(cb)
  })
}
