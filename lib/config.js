const convict = require('convict')

const featureTests = {
  productionOnly (config) {
    return config.get('env') === 'production'
  },
  developmentOnly (config) {
    return config.get('env') === 'development'
  },
  always (config) {
    return true
  }
}

convict.addFormat({
  name: 'placeholder',
  validate: (val) => { },
  coerce: (val, config) =>
    val.replace(/\$\{([\w\.]+)}/g, (v, m) => config.get(m))
})

convict.addFormat({
  name: 'feature',
  validate: (val) => { },
  coerce: (val, config) => featureTests[val](config)
})

const config = convict({
  env: {
    doc: 'The applicaton environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  distPath: {
    doc: 'development distribution path',
    format: '*',
    default: 'dist'
  },
  distGlob: {
    doc: 'dist file glob',
    format: 'placeholder',
    default: '${distPath}/**/*'
  },
  buildPath: {
    doc: 'release build path',
    format: '*',
    default: './build'
  },
  buildGlob: {
    doc: 'release build path',
    format: 'placeholder',
    default: '${buildPath}/**/*'
  },
  stylePath: {
    doc: 'style src path',
    format: '*',
    default: './styles'
  },
  styleGlob: {
    doc: 'style glob pattern',
    format: 'placeholder',
    default: '${stylePath}/*.styl'
  },
  styleWatchGlob: {
    doc: 'style glob pattern',
    format: 'placeholder',
    default: '${stylePath}/**/*.styl'
  },
  styleDistPath: {
    doc: 'style dist path',
    format: 'placeholder',
    default: '${distPath}/css'
  },
  styleDistGlob: {
    doc: 'style glob pattern inside of dist folder',
    format: 'placeholder',
    default: '${styleDistPath}/**/*.css'
  },
  styleBuildPath: {
    doc: 'style dist path',
    format: 'placeholder',
    default: '${buildPath}/css'
  },
  fontPath: {
    doc: 'font src path',
    format: '*',
    default: './fonts'
  },
  fontGlob: {
    doc: 'font src glob',
    format: 'placeholder',
    default: '${fontPath}/**/*'
  },
  fontDistPath: {
    doc: 'font dist path',
    format: 'placeholder',
    default: '${distPath}/fonts'
  },
  fontDistGlob: {
    doc: 'font dist glob',
    format: 'placeholder',
    default: '${distPath}/fonts/**/*'
  },
  fontBuildPath: {
    doc: 'font build path',
    format: 'placeholder',
    default: '${buildPath}/fonts'
  },
  imagesPath: {
    doc: 'image src path',
    format: '*',
    default: './images'
  },
  imagesGlob: {
    doc: 'image glob pattern',
    format: 'placeholder',
    default: '${imagesPath}/**/[^_]*.{jpg,jpeg,png,gif,svg}'
  },
  imagesDistPath: {
    doc: 'image dist path',
    format: 'placeholder',
    default: '${distPath}/images'
  },
  imagesDistGlob: {
    doc: 'image dist glob',
    format: 'placeholder',
    default: '${distPath}/images/**/[^_]*.{jpg,jpeg,png,gif,svg}'
  },
  imagesBuildPath: {
    doc: 'image build path',
    format: 'placeholder',
    default: '${buildPath}/images'
  },
  vendorPath: {
    doc: 'vendor base path',
    format: '*',
    default: './vendor'
  },
  vendorGlob: {
    doc: 'vendor base glob',
    format: 'placeholder',
    default: '${vendorPath}/**/*'
  },
  vendorDistPath: {
    doc: 'vendor base glob',
    format: 'placeholder',
    default: '${distPath}/vendor'
  },
  featureImageOptimization: {
    doc: 'decided whether images should be optimized',
    format: 'feature',
    default: 'productionOnly'
  },
  featureSourceMaps: {
    doc: 'decided whether images should be optimized',
    format: 'feature',
    default: 'developmentOnly'
  },
  featurePrefixStyles: {
    doc: 'decided whether images should be optimized',
    format: 'feature',
    default: 'always'
  }
})

const featureToggles = ['featureImageOptimization', 'featureSourceMaps', 'featurePrefixStyles']

// because of the pre-evaluated feature methods, we have to reset the feature-toggles to make them work as expected.
//
// NOTE: because of its nature, a "in-code" toggled feature will not work atm.
featureToggles.forEach((featureToggle) => config.reset(featureToggle))

module.exports = config