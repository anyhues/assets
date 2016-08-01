const fs = require('fs')
const path = require('path')
const image = require('gulp-image')
const del = require('del')
const watch = require('gulp-watch')
// const print = require('gulp-print')
const filter = require('gulp-filter-by')

const buildImages = (stream, config) => {
  let s = stream

  // if (config.get('featureImageOptimization')) {
  //   s = s
  //   .pipe(gulp.dest(config.get('tmpPath')))
  // }

  return s
}

module.exports = {}
module.exports.load = (gulp, config) => {
  gulp.task('optimize-images', () => {
    return gulp.src(config.get('imagesGlob'))
    .pipe(filter(file => {
      const backupFilePath = path.resolve(config.get('imagesTmpBackupPath'), file.relative)
      return !fs.existsSync(backupFilePath || file.stat.size !== fs.statSync(backupFilePath).size)
    }))
    .pipe(gulp.dest(config.get('imagesTmpBackupPath')))
    // .pipe(print((file) => `${file}: compressing image`))
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
    .pipe(gulp.dest(config.get('imagesTmpOptimizedPath')))
  })

  gulp.task('clean-images', () => del(config.get('imagesBuildPath')))

  gulp.task('images', ['clean-images', 'optimize-images'], () => {
    return buildImages(gulp.src(config.get('imagesTmpOptimizedGlob')), config)
    .pipe(gulp.dest(config.get('imagesBuildPath')))
  })

  gulp.task('watch-images', ['images'], () => buildImages(watch(config.get('imagesGlob')), config).pipe(gulp.dest(config.get('imagesBuildPath'))))
}
