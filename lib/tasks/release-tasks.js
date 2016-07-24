const print = require('gulp-print')
const rev = require('gulp-rev')
const revReplace = require('gulp-rev-replace')
const del = require('del')
const sequence = require('gulp-sequence')

module.exports = {}
module.exports.load = (gulp, config) => {
  const revisionFiles = () => config.get('env') === 'production'

  gulp.task('clean-vendor-assets', () => del(config.get('vendorDistPath')))

  gulp.task('vendor-assets', ['clean-vendor-assets'], () => {
    gulp.src([config.get('vendorGlob')])
    .pipe(gulp.dest(config.get('vendorDistPath')))
  })

  gulp.task('rev-images', ['images'], () => {
    return gulp.src(config.get('imagesDistGlob'), { base: config.get('distPath') })
    .pipe(rev())
    .pipe(gulp.dest(config.get('buildPath')))
    .pipe(rev.manifest())
    .pipe(gulp.dest(config.get('buildPath')))
  })

  gulp.task('rev-assets', ['styles', 'rev-images'], function () {
    const manifest = gulp.src(`${config.get('buildPath')}/rev-manifest.json`)

    return gulp.src(config.get('styleDistGlob'), { base: config.get('distPath') })
    .pipe(revReplace({manifest: manifest}))
    .pipe(rev())
    .pipe(gulp.dest(config.get('buildPath')))  // write rev'd assets to build dir
    .pipe(rev.manifest({
      base: `${config.get('buildPath')}`,
      merge: true
    }))
    .pipe(print((file) => `${file} reference file`))
    .pipe(gulp.dest(config.get('buildPath'))) // write manifest to build dir
  })

  gulp.task('prod-templates', ['templates'], () => {
    let s = gulp.src(config.get('templateDistGlob'))

    if (revisionFiles()) {
      const manifest = gulp.src(`${config.get('buildPath')}/rev-manifest.json`)
      s = s
      .pipe(revReplace({manifest: manifest}))
      .pipe(print((file) => `${file} replacing revision references`))
    }

    return s.pipe(gulp.dest(config.get('templateBuildPath')))
  })

  gulp.task('prod-fonts', ['fonts'], () => {
    return gulp.src(config.get('fontDistGlob'))
    .pipe(gulp.dest(config.get('fontBuildPath')))
  })

  gulp.task('build', ['styles', 'fonts', 'images', 'vendor-assets', 'vendor-assets'], () => {
    // gulp.src(config.get('templateGlob'))
    // .pipe(gulp.dest(config.get('buildPath')))
  })

  gulp.task('check-prod-mode', () => {
    if (config.get('env') !== 'production') throw new Error('production only task!')
  })

  gulp.task('clean-build', () => del(config.get('buildPath')))

  gulp.task('prod-build', (cb) => {
    sequence('check-prod-mode', 'clean-build', 'vendor-assets', 'rev-assets', 'prod-templates', 'prod-fonts')(cb)
  })
}