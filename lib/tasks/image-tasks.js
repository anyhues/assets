const fs = require('fs')
const path = require('path')
const image = require('gulp-image')
const del = require('del')
const watch = require('gulp-watch')
const print = require('gulp-print')
const filter = require('gulp-filter-by')

const buildImages = (stream, config, gulp) => {
  let s = stream

  if (config.get('featureImageOptimization')) {
    s = s
    .pipe(print((file) => `${file}: compressing image`))
    .pipe(filter(file => {
      return !fs.existsSync(path.resolve(config.get('tmpPath'), file.relative))
    }))
    .pipe(image({
      pngquant: true,
      optipng: true,
      zopflipng: true,
      jpegRecompress: true,
      jpegoptim: true,
      mozjpeg: true,
      gifsicle: true,
      svgo: true
    }))
    .pipe(gulp.dest(config.get('tmpPath')))
  }

  return s
}

module.exports = {}
module.exports.load = (gulp, config) => {
  gulp.task('clean-images', () => del(config.get('imagesBuildPath')))

  gulp.task('images', ['clean-images'], () => {
    return buildImages(gulp.src(config.get('imagesGlob')), config, gulp)
    .pipe(gulp.dest(config.get('imagesBuildPath')))
  })

  gulp.task('watch-images', ['images'], () => buildImages(watch(config.get('imagesGlob')), config, gulp).pipe(gulp.dest(config.get('imagesBuildPath'))))
}
