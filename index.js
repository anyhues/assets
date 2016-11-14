const path = require('path')

module.exports = {
  templatePath: path.resolve(__dirname, 'templates'),
  revManifest: path.resolve(__dirname, 'rev-manifest.json'),
  configs: {
    development: {
      'assetHost': 'http://localhost:8235',
      'homeHost': 'http://localhost:8234',
      'couplesHost': 'http://localhost:8236',
      'familyHost': 'http://localhost:8237',
      'singlesHost': 'http://localhost:8238',
      'organisationHost': 'http://localhost:8239'
    },
    production: {
      'assetHost': 'https://niehues-assets.github.io',
      'homeHost': 'http://www.praxis-niehues.de',
      'couplesHost': 'http://www.praxis-niehues.de/paartherapie',
      'familyHost': 'http://www.praxis-niehues.de/familientherapie',
      'singlesHost': 'http://www.praxis-niehues.de/einzeltherapie',
      // 'couplesHost': 'http://www.paartherapeut-essen.de',
      // 'familyHost': 'http://www.familientherapeut-essen.de',
      // 'singlesHost': 'http://www.psychologische-beratung-essen.de',
      'organisationHost': 'http://www.praxis-niehues.de/organisationen'
    }
  },
  templateGlobals: (config) => {
    return {
      ASSET_HOST: config.get('assetHost'),
      COUPLES_HOST: config.get('couplesHost'),
      FAMILY_HOST: config.get('familyHost'),
      HOME_HOST: config.get('homeHost'),
      SINGLES_HOST: config.get('singlesHost'),
      ORGANISATION_HOST: config.get('organisationHost'),
      ENV: config.get('env'),
      DEBUG: config.get('debug')
    }
  }
}
