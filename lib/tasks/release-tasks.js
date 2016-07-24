const print = require('gulp-print')
const rev = require('gulp-rev')
const revReplace = require('gulp-rev-replace')
const del = require('del')
const sequence = require('gulp-sequence')

module.exports = {}
module.exports.load = (gulp, config) => {
  const revisionFiles = () => config.get('env') === 'production'

  gulp.task('clean-vendor-assets', () => del(config.get('vendorBuildPath')))

  gulp.task('vendor-assets', ['clean-vendor-assets'], () => {
    gulp.src([config.get('vendorGlob')])
    .pipe(gulp.dest(config.get('vendorBuildPath')))
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

  gulp.task('prod-fonts', ['fonts'], () => {
    return gulp.src(config.get('fontBuildGlob'))
    .pipe(gulp.dest(config.get('fontDistPath')))
  })

  gulp.task('build', ['styles', 'fonts', 'images', 'vendor-assets', 'vendor-assets'], () => {
    // gulp.src(config.get('templateGlob'))
    // .pipe(gulp.dest(config.get('distPath')))
  })

  gulp.task('check-prod-mode', () => {
    if (config.get('env') !== 'production') throw new Error('production only task!')
  })

  gulp.task('clean-dist', () => del(config.get('distPath')))

  gulp.task('dist', (cb) => {
    sequence('check-prod-mode', 'clean-dist', 'vendor-assets', 'rev-assets', 'prod-fonts')(cb)
  })
}
