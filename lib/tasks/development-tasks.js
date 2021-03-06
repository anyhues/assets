const liveServer = require('live-server')

module.exports = {}
module.exports.load = (gulp, config) => {
  // local dev server
  gulp.task('server', (done) => {
    const serverConfig = {
      port: config.get('port'),
      host: config.get('host'),
      open: false,
      root: config.get('buildPath'),
      wait: 0,
      ignore: 'styles,templates',
      watch: [ 'build' ],
      cors: true
    }

    liveServer.start(serverConfig)
    done()
  })

  // dev dist runner
  gulp.task('watch', ['watch-styles', 'watch-fonts', 'watch-images'])
}
