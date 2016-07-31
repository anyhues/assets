const path = require('path')

module.exports = {
  templatePath: path.resolve(__dirname, 'templates'),
  revManifest: path.resolve(__dirname, 'rev-manifest.json'),
  configs: {
    development: {
      'assetHost': 'http://localhost:8235',
      'homeHost': 'http://localhost:8234',
      'couplesHost': 'http://localhost:8236',
      'familyHost': 'http://localhost:8237'
    },
    production: {
      'assetHost': 'https://niehues-assets.github.io',
      'homeHost': 'https://www.praxis-niehues.de',
      'couplesHost': 'http://www.paartherapeut-essen.de',
      'familyHost': 'http://www.familientherapeut-essen.de'
    }
  }
}
